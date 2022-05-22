/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import Link from 'next/link'
import { Route } from 'src/const/Route'
import LocalStorage from 'src/helper/LocalStorage'
import useRequest from 'src/hook/useRequest'
import { API_ENDPOINT } from 'src/const/Global'
import ReducerActions from 'src/redux/ReducerAction'
import Modal from 'src/components/modal/Modal'

interface MeResponse {
  _id: string
  name: string
  level: 'user' | 'administrator'
}

const DashboardLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false)
  const title = useAppSelector(state => state.ui.title)
  const account = useAppSelector(state => state.account)
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()

  const isMenuActive = (menuUrl: string) => {
    return menuUrl === router.pathname ? 'active' : ''
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = LocalStorage.get('user')?.access_token
      if (!token) return
    }
    authReq<MeResponse>({
      url: `${API_ENDPOINT}/api/me`,
    })
      .then(res => {
        dispatch(
          ReducerActions.account.setAccount({
            level: res.data.level,
            name: res.data.name,
          })
        )
        const homeDashboardRegex = new RegExp(Route.Home + '$', 'g')
        if (homeDashboardRegex.test(router.pathname)) setOpenWelcomeModal(true)
      })
      .catch(() => null)
  }, [])

  const onLogout = () => {
    LocalStorage.clear('user')
    router.push(Route.Login)
  }

  if (typeof window !== 'undefined') {
    const storage = LocalStorage.get('user')
    if (!storage?.access_token) {
      router.push(Route.Login)
      return null
    }
  }

  return (
    <div className='wrapper'>
      <nav className='main-header navbar navbar-expand navbar-white navbar-light'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <a className='nav-link' data-widget='pushmenu' href='#' role='button'>
              <i className='fas fa-bars'></i>
            </a>
          </li>
        </ul>

        <ul className='navbar-nav ml-auto'>
          <li className='nav-item dropdown'>
            <a className='nav-link' data-toggle='dropdown' href='#'>
              <i className='fas fa-cog'></i>
            </a>
            <div className='dropdown-menu dropdown-menu-lg dropdown-menu-right'>
              <span className='dropdown-item dropdown-header'>More</span>
              <div className='dropdown-divider'></div>
              <a href='#' className='dropdown-item d-flex align-items-center'>
                <div style={{ width: '28px' }}>
                  <i className='fas fa-user-lock'></i>
                </div>
                <p>Ubah Password</p>
              </a>
              <div className='dropdown-divider'></div>
              <div style={{ cursor: 'pointer' }} onClick={onLogout} className='dropdown-item d-flex align-items-center'>
                <div style={{ width: '28px' }}>
                  <i className='fas fa-sign-out-alt'></i>
                </div>
                <p>Logout</p>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div className='main-sidebar sidebar-dark-primary elevation-4'>
        <a href='index3.html' className='brand-link'>
          <p className='brand-text font-weight-light m-0' style={{ textAlign: 'center' }}>
            TOPSIS HOME
          </p>
        </a>

        <div className='sidebar' style={{ height: 'calc(100vh - 57px)' }}>
          <div className='user-panel mt-3 pb-3 mb-3 d-flex'>
            <div className='image'>
              <img src='/dist/img/user2-160x160.jpg' className='img-circle elevation-2' alt='User Image' />
            </div>
            <div className='info'>
              <a href='#' className='d-block'>
                {account.name}
              </a>
            </div>
          </div>
          <nav className='mt-2'>
            <ul
              className='nav nav-pills nav-sidebar flex-column'
              data-widget='treeview'
              role='menu'
              data-accordion='false'>
              <li className='nav-item'>
                <Link href={Route.Home}>
                  <a className={`nav-link ${isMenuActive(Route.Home)}`}>
                    <i className='nav-icon fas fa-home'></i>
                    <p>Home</p>
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href={Route.Criteria}>
                  <a className={`nav-link ${isMenuActive(Route.Criteria)}`}>
                    <i className='nav-icon fas fa-book'></i>
                    <p>Data Kriteria</p>
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href={Route.Banjar}>
                  <a className={`nav-link ${isMenuActive(Route.Banjar)}`}>
                    <i className='nav-icon fas fa-university'></i>
                    <p>Data Banjar</p>
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href={Route.Alternative}>
                  <a className={`nav-link ${isMenuActive(Route.Alternative)}`}>
                    <i className='nav-icon fas fa-file-alt'></i>
                    <p>Data Alternatif</p>
                  </a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href={Route.Result}>
                  <a className={`nav-link ${isMenuActive(Route.Result)}`}>
                    <i className='nav-icon fas fa-table'></i>
                    <p>Seleksi</p>
                  </a>
                </Link>
              </li>
              {account.level === 'administrator' && (
                <li className='nav-item'>
                  <Link href={Route.UserAccess}>
                    <a className={`nav-link ${isMenuActive(Route.UserAccess)}`}>
                      <i className='nav-icon fas fa-users'></i>
                      <p>Akses Pengguna</p>
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      <div className='content-wrapper content-wrappers'>
        <div className='content-header'>
          <div className='container-fluid'>
            <div className='row mb-2'>
              <div className='col-12'>
                <h1 className='m-0'>{title}</h1>
              </div>
            </div>
          </div>
        </div>

        <section className='content'>
          <div className='container-fluid'>{children}</div>
        </section>
      </div>

      <footer className='main-footer'>
        <p>
          <strong>Copyright &copy; {new Date().getFullYear()}</strong> Roy Mahardika
        </p>
      </footer>
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

const withDashboardLayout = (pageComponent: NextPageWithLayout<any, any>) => {
  pageComponent.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
  }
}

export default withDashboardLayout
