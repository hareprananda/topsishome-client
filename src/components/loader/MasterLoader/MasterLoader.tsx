import React from 'react'
import { useAppSelector } from 'src/hook/useRedux'

const MasterLoader = () => {
  const masterLoader = useAppSelector(state => state.ui.masterLoader)
  return masterLoader ? (
    <div className='masterLoader__container'>
      <h1>Loading ...</h1>
    </div>
  ) : null
}

export default MasterLoader
