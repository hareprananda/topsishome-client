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

const Index: NextPageWithLayout = () => {
  const [result, setResult] = useState<Result[]>([])
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Result[] }>(TopsisConfig.result())
      .then(res => {
        setResult(res.data.data)
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }, [])

  return (
    <div>
      <div className='card card-default'>
        <div className='card-header'>
          <h4>Final Ranking</h4>
        </div>
        <div className='card-body'>
          {result.map((res, idx) => (
            <Link key={res.id} href={Route.AlternativeDetail(res.id)}>
              <a>
                <div className={`callout callout-${idx < 3 ? 'success' : 'danger'} position-relative`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ position: 'absolute', top: '50%', transform: 'translate(0, -50%)', left: '15px' }}>
                      {idx + 1}
                    </h4>
                    <div style={{ marginLeft: '40px' }}>
                      <h5>{res.nama}</h5>
                      <p>{res.value.toFixed(4)}</p>
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
