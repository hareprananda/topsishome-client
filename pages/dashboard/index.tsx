import React, { useEffect } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'

const Index: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))
  }, [])

  return (
    <div>
      <p>Menampilkan hasil dari perhitungan</p>
    </div>
  )
}

export default Index
withDashboardLayout(Index)
