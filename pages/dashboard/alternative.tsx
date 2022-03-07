import React from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'

const Alternative: NextPageWithLayout = () => {
  return <div>Alternative</div>
}

export default Alternative
withDashboardLayout(Alternative)
