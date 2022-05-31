import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { Banjar } from 'src/request/banjar/Banjar.model'
import BanjarConfig from 'src/request/banjar/BanjarConfig'
import { Criteria } from 'src/request/criteria/Criteria.model'
import { ResultDetail } from 'src/request/topsis/Topsis.model'
import TopsisConfig from 'src/request/topsis/TopsisConfig'

const Result = () => {
  const [resultDetail, setResultDetail] = useState({} as ResultDetail)
  const [allCriteria, setAllCriteria] = useState<Pick<Criteria, '_id' | 'name'>[]>([])
  const [allBanjar, setAllBanjar] = useState<Banjar[]>([])
  const [savedFilter, setSavedFilter] = useState<{ banjar?: string; year?: string }>({})
  const [tahunPenerima, setTahunPenerima] = useState(new Date().getFullYear())
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()

  const requestResultDetail = (params?: Partial<Record<'banjar' | 'year', string>>) => {
    setResultDetail({} as ResultDetail)
    authReq<{ data: ResultDetail }>(TopsisConfig.resultDetail(params))
      .then(res => {
        setAllCriteria(res.data.data.rawData[0]?.criteria.map(({ _id, name }) => ({ _id, name })) || [])
        setSavedFilter(params || {})
        setResultDetail(res.data.data)
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Seleksi'))
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Banjar[] }>(BanjarConfig.get())
      .then(res => {
        setAllBanjar(res.data.data)
      })
      .catch(() => null)
    requestResultDetail()

    const currentYear = new Date().getFullYear()
    setTahunPenerima(currentYear - 1)
  }, [])

  const submitFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as EventTarget & Record<'banjar' | 'year', HTMLInputElement>
    let filter: Record<string, any> = {
      banjar: target.banjar.value,
      year: target.year.value,
    }
    filter = Object.keys(filter).reduce((acc, v) => {
      if (!filter[v]) return acc
      acc[v] = filter[v]
      return acc
    }, {} as Record<string, any>)
    dispatch(ReducerActions.ui.masterLoader(true))
    requestResultDetail(filter)
  }

  const downloadReport = () => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<BlobPart>(TopsisConfig.topsisReport(savedFilter))
      .then(res => {
        const link = document.createElement('a')
        const fileName = 'Report.xlsx'
        link.setAttribute('download', fileName)
        link.href = URL.createObjectURL(new Blob([res.data]))
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(() => null)
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }

  const downloadSurat = () => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<BlobPart>(TopsisConfig.penerima({ year: tahunPenerima.toString() }))
      .then(res => {
        const link = document.createElement('a')
        const fileName = 'SuratPenerima.pdf'
        link.setAttribute('download', fileName)
        link.href = URL.createObjectURL(new Blob([res.data]))
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400 || err.response?.status === 500) {
          dispatch(
            ReducerActions.ui.setStatusModal({
              title: 'Oops',
              message: 'Something gone wrong',
              type: 'error',
            })
          )
        }
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  const renderNormalisasiTyped = (
    renderedData: ResultDetail['rawData'] | ResultDetail['normalisasi'] | ResultDetail['normalisasiTerbobot'],
    title: string,
    roundDecimal: boolean = false
  ) => {
    return (
      <div className='card card-default'>
        <div className='card-header'>
          <h4>{title}</h4>
        </div>
        <div className='card-body'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Nama</th>
                {allCriteria.map(cr => (
                  <th scope='col' key={cr._id}>
                    {cr.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderedData?.map((data, idx) => (
                <tr key={data._id}>
                  <th scope='row'>{idx + 1}</th>
                  <td>{data.nama}</td>
                  {data.criteria.map(cr => (
                    <td key={cr._id}>{roundDecimal ? cr.value.toFixed(5) : cr.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const { rawData, normalisasi, normalisasiTerbobot, idealSolution, idealSolutionDistance, finalRanking } = resultDetail

  return (
    <div>
      <div className='card'>
        <div className='card-header'>
          <h3 className='card-title'>Download Surat Penerima</h3>
        </div>
        <div className='card-body'>
          <select
            value={tahunPenerima}
            onChange={e => setTahunPenerima(parseInt(e.target.value))}
            className='custom-select'>
            <option value=''>Data Terbaru</option>
            {(() => {
              const currentDate = new Date().getFullYear()
              const optionEl: JSX.Element[] = []
              for (let i = currentDate; i >= currentDate - 4; i--)
                optionEl.push(
                  <option key={i} value={i}>
                    {i}
                  </option>
                )
              return optionEl
            })()}
          </select>
          <button className='btn btn-primary mt-2' onClick={downloadSurat}>
            <i className='fas fa-download' /> Download Surat Penerima
          </button>
        </div>
      </div>
      <div className='card'>
        <div className='card-header'>
          <div className='d-flex justify-content-between'>
            <h3 className='card-title'>Filter</h3>
          </div>
        </div>
        <div className='card-body'>
          <form onSubmit={submitFilter}>
            <div className='form-group'>
              <label htmlFor='inputGroupSelect01'>Tahun</label>
              <select name='year' defaultValue={''} className='custom-select' id='inputGroupSelect01'>
                <option value=''>Choose...</option>
                {(() => {
                  const currentYear = new Date().getFullYear()
                  const optionArr: JSX.Element[] = []
                  for (let i = currentYear; i >= currentYear - 4; i--) optionArr.push(<option value={i}>{i}</option>)
                  return optionArr
                })()}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='banjarInput'>Banjar</label>
              <select name='banjar' defaultValue={''} className='custom-select' id='banjarInput'>
                <option value=''>Semua banjar</option>
                {allBanjar.map((v, k) => (
                  <option key={k} value={v._id}>
                    {v.nama}
                  </option>
                ))}
              </select>
            </div>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </form>
        </div>
      </div>
      {Object.keys(resultDetail).length !== 0 && (
        <div className='card'>
          <div className='card-header d-flex p-0'>
            <h3 className='card-title p-3'>
              Seleksi {savedFilter.banjar ? `Banjar ${finalRanking?.[0]?.banjar}` : 'Desa'}{' '}
              {`Tahun ${finalRanking?.[0]?.year}`}
            </h3>
            <ul className='nav nav-pills ml-auto p-2'>
              <li className='nav-item'>
                <a className='nav-link active' href='#tab_1' data-toggle='tab'>
                  Process
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#tab_2' data-toggle='tab'>
                  Result
                </a>
              </li>
            </ul>
          </div>
          <div className='card-body'>
            <div className='tab-content'>
              <div className='tab-pane active' id='tab_1'>
                {renderNormalisasiTyped(rawData, 'Data Perhitungan')}
                {renderNormalisasiTyped(normalisasi, 'Normalisasi Data', true)}
                {renderNormalisasiTyped(normalisasiTerbobot, 'Normalisasi Terbobot', true)}
                <div className='card card-default'>
                  <div className='card-header'>
                    <h4>Solusi Ideal</h4>
                  </div>
                  <div className='card-body'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col'></th>
                          <th scope='col'>Positif</th>
                          <th scope='col'>Negatif</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCriteria.map(cr => (
                          <tr key={cr._id}>
                            <th scope='row'>{cr.name}</th>
                            <td>{idealSolution.positif[cr.name]?.toFixed(5)}</td>
                            <td>{idealSolution.negatif[cr.name]?.toFixed(5)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className='card card-default'>
                  <div className='card-header'>
                    <h4>Jarak Solusi Ideal</h4>
                  </div>
                  <div className='card-body'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col'>Nama</th>
                          <th scope='col'>D+</th>
                          <th scope='col'>D-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {idealSolutionDistance.map(solution => (
                          <tr key={solution.id}>
                            <th scope='row'>{solution.nama}</th>
                            <td>{solution.dPlus?.toFixed(5)}</td>
                            <td>{solution.dMin?.toFixed(5)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='tab-pane' id='tab_2'>
                <div className='card card-default'>
                  <div className='card-header'>
                    <div
                      style={{ flex: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4>Final Ranking</h4>
                      <button
                        disabled={!resultDetail.finalRanking?.length}
                        className='btn btn-success'
                        onClick={downloadReport}>
                        <i className='fas fa-download' /> Download Laporan Excel
                      </button>
                    </div>
                  </div>
                  <div className='card-body'>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col'>Nama</th>
                          <th scope='col'>Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalRanking.map(rank => (
                          <tr key={rank.id}>
                            <td>{rank.nama}</td>
                            <td>{rank.value.toFixed(5)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Result
withDashboardLayout(Result)
