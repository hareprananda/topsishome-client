import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import { NextPageWithLayout } from './_app'

type ServerSideProps = {
  title: string
}

const Home: NextPageWithLayout<ServerSideProps> = ({ title: defaultTitle }) => {
  const title = useAppSelector(state => state.ui.title)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle(defaultTitle))
  })
  const changeTitle = () => {
    dispatch(ReducerActions.ui.setTitle('Changed title'))
  }
  return (
    <>
      <div className="card card-outline card-primary">
        <div className="card-header">
          <h3 className="card-title">Primary Card Example</h3>
        </div>
        <div className="card-body">The body of the card</div>
        <div className="card-footer">The footer of the card</div>
      </div>
      <button onClick={changeTitle}>KLIK change title </button>
      <h1>this is the title {title}</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  return { props: { title: 'Dashboard' } }
}

export default Home
withDashboardLayout(Home)
