import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement } from 'react'

const AuthLayout: React.FC = ({ children }) => {
  return (
    <div className='auth__container'>
      <div className='auth__image' />

      <div className='auth__content'>{children}</div>
    </div>
  )
}

const withAuthLayout = (pageComponent: NextPageWithLayout<any, any>) => {
  pageComponent.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>
}

export default withAuthLayout
