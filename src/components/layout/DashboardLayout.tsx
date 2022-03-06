/* eslint-disable @next/next/no-img-element */
import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement } from 'react'
import { useAppSelector } from 'src/hook/useRedux'
const DashboardLayout: React.FC = ({ children }) => {
  const title = useAppSelector(state => state.ui.title)
  const account = useAppSelector(state => state.account)
  return (
    <div className="wrapper">
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fas fa-cog"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">More</span>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item d-flex align-items-center">
                <div style={{ width: '28px' }}>
                  <i className="fas fa-user-lock"></i>
                </div>
                <p>Ubah Password</p>
              </a>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item d-flex align-items-center">
                <div style={{ width: '28px' }}>
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <p>Logout</p>
              </a>
            </div>
          </li>
        </ul>
      </nav>

      <div className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index3.html" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: '0.8' }}
          />
          <span className="brand-text font-weight-light">AdminLTE 3</span>
        </a>

        <div className="sidebar" style={{ height: 'calc(100vh - 57px)' }}>
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {account.name}
              </a>
            </div>
          </div>
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false">
              <li className="nav-item">
                <a href="iframe.html" className="nav-link active">
                  <i className="nav-icon fas fa-home"></i>
                  <p>Home</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="iframe.html" className="nav-link">
                  <i className="nav-icon fas fa-book"></i>
                  <p>Data Kriteria</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="iframe.html" className="nav-link">
                  <i className="nav-icon fas fa-file-alt"></i>
                  <p>Data Alternatif</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="iframe.html" className="nav-link">
                  <i className="nav-icon fas fa-table"></i>
                  <p>Hasil Seleksi</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="content-wrapper content-wrappers">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-12">
                <h1 className="m-0">{title}</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">{children}</div>
        </section>
      </div>

      <footer className="main-footer">
        <p>
          <strong>Copyright &copy; {new Date().getFullYear()}</strong> Roy Mahardika
        </p>
      </footer>
    </div>
  )
}

const withDashboardLayout = (pageComponent: NextPageWithLayout<any, any>) => {
  pageComponent.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
  }
}

export default withDashboardLayout
