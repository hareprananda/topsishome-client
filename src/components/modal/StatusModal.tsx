import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'

const StatusModal = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dispatch = useAppDispatch()
  const modalData = useAppSelector(state => state.ui.statusModal)
  useEffect(() => {
    const { message, title } = modalData
    if ([message, title].every(text => text === '')) return
    toggleModal()
  }, [modalData])

  const toggleModal = () => {
    buttonRef.current?.click()
  }

  const clearModal = () => {
    toggleModal()
    modalData.onClick()
    setTimeout(() => {
      dispatch(
        ReducerActions.ui.setStatusModal({
          message: '',
          title: '',
          type: modalData.type,
          buttonText: 'Ok',
          onClick: () => null,
        })
      )
    }, 500)
  }
  return (
    <>
      <button
        type='button'
        ref={buttonRef}
        data-toggle='modal'
        data-target={`#status-modal`}
        style={{ display: 'none' }}
      />

      <div
        className='modal fade'
        id={'status-modal'}
        tabIndex={-1}
        role='dialog'
        aria-hidden='true'
        style={{ zIndex: 2000 }}>
        <div className={`modal-dialog modal-md`} role='document'>
          <div className='modal-content'>
            <div className='modal-body'>
              {modalData.type === 'error' && <i className='fas fa-times text-danger' />}
              {modalData.type === 'success' && <i className='fas fa-check text-success' />}
              <h2>{modalData.title}</h2>
              <p>{modalData.message}</p>

              <button
                type='button'
                className={`btn ${modalData.type === 'error' ? 'btn-danger' : 'btn-success'}`}
                onClick={clearModal}>
                {modalData.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatusModal
