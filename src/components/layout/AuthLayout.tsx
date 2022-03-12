import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import React, { ReactElement } from 'react'
import { Route } from 'src/const/Route'
import LocalStorage from 'src/helper/LocalStorage'

const AuthLayout: React.FC = ({ children }) => {
  const router = useRouter()

  if (typeof window !== 'undefined' && LocalStorage.get('user')) {
    router.push(Route.Home)
    return null
  }
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
