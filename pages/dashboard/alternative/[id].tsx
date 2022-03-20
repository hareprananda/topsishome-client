import { GetServerSideProps } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect, useState } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import AlternativeDetail from 'src/components/page/alternative/AlternativeDetail'
import AlternativeForm, { PengajuanDetail } from 'src/components/page/alternative/AlternativeForm'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'

interface PageRouter extends NextRouter {
  query: {
    id: string
    edit?: string
  }
}

interface Props {
  id: string
}

const DetailAlternative: NextPageWithLayout<Props> = ({ id: altId }) => {
  const router = useRouter() as PageRouter
  const [pengajuanData, setPengajuanData] = useState({} as PengajuanDetail)
  const { edit } = router.query
  const id = router.query.id || altId
  const [mode, setMode] = useState<'view' | 'edit'>(edit ? 'edit' : 'view')
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  useEffect(() => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: PengajuanDetail }>({
      url: API_ENDPOINT + `/api/pengajuan/${id}`,
      method: 'GET',
    })
      .then(res => {
        setPengajuanData(res.data.data)
      })
      .catch(() => {
        dispatch(ReducerActions.ui.setStatusModal({ type: 'error', title: 'Oops', message: 'Data not found' }))
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }, [])

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Detail ' + pengajuanData?.nama))
  }, [pengajuanData])

  return (
    <div className='card text-center'>
      <div className='card-header'>
        <ul className='nav nav-pills card-header-pills'>
          <li className='nav-item'>
            <div
              className={`nav-link ${mode === 'view' ? 'active' : ''}`}
              onClick={() => setMode('view')}
              style={{ cursor: 'pointer' }}>
              Detail
            </div>
          </li>
          <li className='nav-item'>
            <div
              className={`nav-link ${mode === 'edit' ? 'active' : ''}`}
              onClick={() => setMode('edit')}
              style={{ cursor: 'pointer' }}>
              Update
            </div>
          </li>
        </ul>
      </div>
      <div className='card-body'>
        {mode === 'edit' ? (
          <AlternativeForm pengajuan={pengajuanData} setPengajuan={setPengajuanData} />
        ) : (
          <AlternativeDetail pengajuan={pengajuanData} />
        )}
      </div>
    </div>
  )
}

export default DetailAlternative
withDashboardLayout(DetailAlternative)

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      id: context.params?.id,
    },
  }
}
