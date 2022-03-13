import { NextPageWithLayout } from 'pages/_app'
import React, { useEffect } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import AlternativeForm from 'src/components/page/alternative/AlternativeForm'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'

const AddAlternative: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Tambah alternatif'))
  }, [])
  return (
    <div>
      <div className='card'>
        <div className='card-body'>
          <AlternativeForm />
        </div>
      </div>
    </div>
  )
}

export default AddAlternative
withDashboardLayout(AddAlternative)
