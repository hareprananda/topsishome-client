import React, { useEffect, useState } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import Modal from 'src/components/modal/Modal'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'

const Index: NextPageWithLayout = () => {
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))
    setOpenWelcomeModal(true)
  }, [])
  return (
    <div>
      <p>Menampilkan hasil dari perhitungan</p>
      <Modal
        open={openWelcomeModal}
        size='lg'
        title='Selamat Datang di SPK Bantuan Bedah rumah'
        setOpen={setOpenWelcomeModal}>
        <p>
          Dalam upaya membantu masyarakat miskin, Pemerintah kabupaten Badung merancang program rumah layak huni agar
          masyarakat Kabupaten Badung mendapatkan rumah yang layak dan mensejahterakan masyarakat kabupaten badung
        </p>
      </Modal>
    </div>
  )
}

export default Index
withDashboardLayout(Index)
