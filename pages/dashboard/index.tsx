import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import useRequest from 'src/hook/useRequest'
import TopsisConfig from 'src/request/topsis/TopsisConfig'
import { Result } from 'src/request/topsis/Topsis.model'
import Link from 'next/link'
import { Route } from 'src/const/Route'
import useChart from 'src/hook/useChart'
import { Banjar } from 'src/request/banjar/Banjar.model'
import BanjarConfig from 'src/request/banjar/BanjarConfig'

const Index: NextPageWithLayout = () => {
  const maxPerPage = useMemo(() => 20, [])
  const [result, setResult] = useState<Result[]>([])
  const [bigTen, setBigTen] = useState<Result[]>([])
  const [filter, setFilter] = useState({ banjar: '', year: '' })
  const [allBanjar, setAllBanjar] = useState<Banjar[]>([])
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')
  const [metadata, setMetadata] = useState({ currentPage: 1, maxPage: 1 })

  const { chart: bigTenChart, updateChart } = useChart('bigTenChart', {
    type: 'pie',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Jumlah KK',
          data: [],
          backgroundColor: '#007bff',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 18,
            },
          },
        },
      },
    },
  })

  const requestTimes = useRef(1)

  const requestResult = () => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Result[] }>(TopsisConfig.result(filter))
      .then(res => {
        if (requestTimes.current === 1) setBigTen(res.data.data.slice(0, 10))
        setResult(res.data.data)
        requestTimes.current += 1
        setMetadata({
          currentPage: 1,
          maxPage: Math.ceil(res.data.data.length / maxPerPage),
        })
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  useEffect(() => {
    if (!bigTenChart) return
    const scales =
      chartType === 'bar'
        ? {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (tickVal: string | number) => Math.floor(tickVal as number),
              },
            },
          }
        : {}
    const colorArray = ['#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#343a40']
    const backgroundColor: typeof bigTenChart['data']['datasets'][number]['backgroundColor'] =
      chartType === 'pie'
        ? Object.keys(bigTenChart.data.datasets[0].data).map((_, idx) => colorArray[idx % colorArray.length])
        : colorArray[0]
    updateChart({
      type: chartType,
      //@ts-ignore
      data: { ...bigTenChart.data, datasets: [{ ...bigTenChart.data.datasets[0], backgroundColor }] },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: scales,
      },
    })
  }, [chartType])

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))

    authReq<{ data: Banjar[] }>(BanjarConfig.get())
      .then(res => {
        setAllBanjar(res.data.data)
      })
      .catch(() => null)
  }, [])

  useEffect(() => {
    requestResult()
  }, [filter])

  useEffect(() => {
    if (bigTen.length === 0) return
    const bigTenChartData = bigTen.reduce((acc, v) => {
      if (acc[v.banjar] === undefined) {
        acc[v.banjar] = 1
        return acc
      }
      acc[v.banjar] += 1
      return acc
    }, {} as Record<string, number>)

    if (!bigTenChart) return
    const colorArray = ['#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#343a40']
    bigTenChart.data.datasets[0].backgroundColor = Object.keys(bigTenChartData).map(
      (_, idx) => colorArray[idx % colorArray.length]
    )
    bigTenChart.data.labels = Object.keys(bigTenChartData)
    bigTenChart.data.datasets[0].data = Object.values(bigTenChartData)
    bigTenChart?.update()
  }, [bigTen])

  const changeFilter = (value: string, filterKey: 'banjar' | 'year') => {
    setFilter({
      ...filter,
      [filterKey]: value,
    })
  }

  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <div className='card card-default'>
            <div className='card-header'>
              <h4 className='card-title font-weight-bold' style={{ fontSize: '25px' }}>
                Penerima per banjar
              </h4>
              <div className='card-tools'>
                <button className='btn btn-primary' onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}>
                  {chartType === 'bar' ? 'Pie' : 'Bar'} Chart
                </button>
              </div>
            </div>
            <div className='card-body'>
              <canvas id='bigTenChart' style={{ height: '400px' }} />
            </div>
          </div>
        </div>
      </div>
      <div className='card card-default'>
        <div className='card-header'>
          <h4 className='card-title font-weight-bold' style={{ fontSize: '25px' }}>
            Final Rankings
          </h4>
          <div className='card-tools d-flex'>
            <select
              defaultValue={''}
              onChange={e => changeFilter(e.target.value, 'banjar')}
              className='custom-select'
              style={{ minWidth: '200px' }}>
              <option value=''>Semua Banjar</option>
              {allBanjar.map((v, k) => (
                <option key={k} value={v._id}>
                  {v.nama}
                </option>
              ))}
            </select>
            <select
              defaultValue={''}
              onChange={e => changeFilter(e.target.value, 'year')}
              className='custom-select'
              style={{ minWidth: '200px', marginLeft: '10px' }}>
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
          </div>
        </div>
        <div className='card-body'>
          {result.slice((metadata.currentPage - 1) * maxPerPage, metadata.currentPage * maxPerPage).map((res, idx) => (
            <Link key={res.id} href={Route.AlternativeDetail(res.id)}>
              <a>
                <div className={`callout callout-${idx < 10 ? 'success' : 'danger'} position-relative`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ position: 'absolute', top: '50%', transform: 'translate(0, -50%)', left: '15px' }}>
                      {(metadata.currentPage - 1) * maxPerPage + idx + 1}
                    </h4>
                    <div style={{ marginLeft: '40px' }}>
                      <h5 className='m-0'>{res.nama}</h5>
                      <p className='m-0'>Alamat: {res.alamat}</p>
                      <p>Nilai: {res.value.toFixed(4)}</p>
                    </div>

                    <i className='fas fa-chevron-right'></i>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        <div className='card-footer'>
          <nav aria-label='Page navigation example'>
            <ul className='pagination justify-content-center'>
              <li className={`page-item ${metadata.currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className='page-link'
                  onClick={() => setMetadata(c => ({ ...c, currentPage: c.currentPage - 1 }))}>
                  <i className='fas fa-chevron-left'></i>
                </button>
              </li>
              <li className={`page-item`}>
                <div className='page-link'>{`Page ${metadata.currentPage} of ${metadata.maxPage}`}</div>
              </li>
              <li className={`page-item ${metadata.currentPage === metadata.maxPage ? 'disabled' : ''}`}>
                <button
                  onClick={() => setMetadata(c => ({ ...c, currentPage: c.currentPage + 1 }))}
                  className='page-link'>
                  <i className='fas fa-chevron-right'></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Index
withDashboardLayout(Index)
