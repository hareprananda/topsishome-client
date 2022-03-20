import React, { useEffect, useState } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { Criteria } from 'src/request/criteria/Criteria.model'
import { ResultDetail } from 'src/request/topsis/Topsis.model'
import TopsisConfig from 'src/request/topsis/TopsisConfig'

const Result = () => {
  const [resultDetail, setResultDetail] = useState({} as ResultDetail)
  const [allCriteria, setAllCriteria] = useState<Pick<Criteria, '_id' | 'name'>[]>([])
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Detail Result'))
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: ResultDetail }>(TopsisConfig.resultDetail())
      .then(res => {
        setAllCriteria(res.data.data.rawData[0].criteria.map(({ _id, name }) => ({ _id, name })))
        setResultDetail(res.data.data)
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }, [])

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

  if (Object.keys(resultDetail).length === 0) return null

  const { rawData, normalisasi, normalisasiTerbobot, idealSolution, idealSolutionDistance, finalRanking } = resultDetail

  return (
    <div>
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

      <div className='card card-default'>
        <div className='card-header'>
          <h4>Final Ranking</h4>
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
  )
}

export default Result
withDashboardLayout(Result)
