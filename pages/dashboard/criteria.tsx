import { NextPageWithLayout } from 'pages/_app'
import React from 'react'
import withDashboardLayout from 'src/components/layout/DashboardLayout'

const Criteria: NextPageWithLayout = () => {
  return <div>Criteria</div>
}

export default Criteria
withDashboardLayout(Criteria)
