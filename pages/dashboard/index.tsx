import React, { useEffect, useState } from 'react'
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
import { PengajuanChart } from 'src/request/pengajuan/Pengajuan.model'
import PengajuanConfig from 'src/request/pengajuan/PengajuanConfig'
import { Banjar } from 'src/request/banjar/Banjar.model'
import BanjarConfig from 'src/request/banjar/BanjarConfig'

const Index: NextPageWithLayout = () => {
  const [result, setResult] = useState<Result[]>([])
  const [allBanjar, setAllBanjar] = useState<Banjar[]>([])
  const [chartData, setChartData] = useState<PengajuanChart>({
    gender: [],
    status: [],
    umur: [],
  })
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  const statusChart = useChart('statusChart', {
    type: 'pie',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#dc3545', '#007bff'],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
    },
  })

  const genderChart = useChart('genderChart', {
    type: 'pie',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#dc3545', '#007bff'],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
    },
  })

  const umurChart = useChart('umurChart', {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Usia',
          data: [],
          backgroundColor: '#007bff',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
    },
  })

  const requestResult = (data?: { banjar: string }) => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Result[] }>(TopsisConfig.result(data || {}))
      .then(res => {
        setResult(res.data.data)
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))

    requestResult()

    authReq<{ data: PengajuanChart }>(PengajuanConfig.pengajuanChart())
      .then(res => {
        setChartData(res.data.data)
      })
      .catch(() => null)

    authReq<{ data: Banjar[] }>(BanjarConfig.get())
      .then(res => {
        setAllBanjar(res.data.data)
      })
      .catch(() => null)
  }, [])

  useEffect(() => {
    if (chartData.gender.length === 0 || !statusChart || !genderChart || !umurChart) return
    statusChart.data.labels = chartData.status.map(v => v._id)
    statusChart.data.datasets[0].data = chartData.status.map(v => v.count)
    statusChart?.update()

    genderChart.data.labels = chartData.gender.map(v => v._id)
    genderChart.data.datasets[0].data = chartData.gender.map(v => v.count)
    genderChart?.update()

    umurChart.data.labels = chartData.umur.map(v => v._id)
    umurChart.data.datasets[0].data = chartData.umur.map(v => v.count)
    umurChart?.update()
  }, [chartData])

  const changeBanjar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    requestResult({ banjar: e.target.value })
  }

  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <div className='card card-default'>
            <div className='card-header'>
              <h4>Umur</h4>
            </div>
            <div className='card-body'>
              <canvas id='umurChart' style={{ height: '400px' }} />
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className='card card-default'>
            <div className='card-header'>
              <h4>Status</h4>
            </div>
            <div className='card-body'>
              <canvas id='statusChart' />
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className='card card-default'>
            <div className='card-header'>
              <h4>Jenis Kelamin</h4>
            </div>
            <div className='card-body'>
              <canvas id='genderChart' />
            </div>
          </div>
        </div>
      </div>
      <div className='card card-default'>
        <div className='card-header'>
          <h4 className='card-title font-weight-bold' style={{ fontSize: '24px!important' }}>
            Final Rankings
          </h4>
          <div className='card-tools'>
            <select onChange={changeBanjar} className='custom-select' style={{ minWidth: '200px' }}>
              <option selected value=''>
                Semua Banjar
              </option>
              {allBanjar.map((v, k) => (
                <option key={k} value={v._id}>
                  {v.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='card-body'>
          {result.map((res, idx) => (
            <Link key={res.id} href={Route.AlternativeDetail(res.id)}>
              <a>
                <div className={`callout callout-${idx < 10 ? 'success' : 'danger'} position-relative`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ position: 'absolute', top: '50%', transform: 'translate(0, -50%)', left: '15px' }}>
                      {idx + 1}
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
      </div>
    </div>
  )
}

export default Index
withDashboardLayout(Index)
