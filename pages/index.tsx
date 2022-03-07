import { useEffect, useState } from 'react'
import Modal from 'src/components/element/modal/Modal'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import { NextPageWithLayout } from './_app'

// type ServerSideProps = {
//   title: string
// }

const Home: NextPageWithLayout = () => {
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Home'))
    setOpenWelcomeModal(true)
  }, [])

  return (
    <>
      <p>Menampilkan hasil dari perhitungan</p>
      <Modal
        open={openWelcomeModal}
        size="lg"
        title="Selamat Datang di SPK Bantuan Bedah rumah"
        setOpen={setOpenWelcomeModal}>
        <p>
          Dalam upaya membantu masyarakat miskin, Pemerintah kabupaten Badung merancang program rumah layak huni agar
          masyarakat Kabupaten Badung mendapatkan rumah yang layak dan mensejahterakan masyarakat kabupaten badung
        </p>
      </Modal>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
//   return { props: { title: 'Dashboard' } }
// }

export default Home
withDashboardLayout(Home)
