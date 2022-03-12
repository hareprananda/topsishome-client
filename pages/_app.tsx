import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import ReduxProvider from 'src/redux/ReduxProvider'
import 'src/styles/globals.css'
import MasterLoader from 'src/components/loader/MasterLoader/MasterLoader'
import StatusModal from 'src/components/modal/StatusModal'
import ConfirmationModal from 'src/components/modal/ConfirmationModal'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <ReduxProvider>
      <MasterLoader />
      <StatusModal />
      <ConfirmationModal />
      {getLayout(<Component {...pageProps} />)}
    </ReduxProvider>
  )
}
