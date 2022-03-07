import React from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'

const Index: NextPageWithLayout = () => {
  return (
    <div>
      <h1>This is index</h1>
    </div>
  )
}

export default Index
withDashboardLayout(Index)
