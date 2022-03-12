import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'

const ConfirmationModal = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dispatch = useAppDispatch()
  const modalData = useAppSelector(state => state.ui.confirmationModal)
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
    setTimeout(() => {
      dispatch(
        ReducerActions.ui.setConfirmationmodal({
          message: '',
          title: '',
          abortButtonText: 'Cancel',
          confirmButtonText: 'Ok',
          onAbort: () => null,
          onConfirm: () => null,
        })
      )
    }, 500)
  }

  const abortModal = () => {
    clearModal()
    modalData.onAbort()
  }

  const confirmModal = () => {
    clearModal()
    modalData.onConfirm()
  }

  return (
    <>
      <button
        type='button'
        ref={buttonRef}
        data-toggle='modal'
        data-target={`#confirmation-modal`}
        style={{ display: 'none' }}
      />

      <div className='modal fade' id={'confirmation-modal'} tabIndex={-1} role='dialog' aria-hidden='true'>
        <div className={`modal-dialog modal-md`} role='document'>
          <div className='modal-content'>
            <div className='modal-body'>
              <i className='fas fa-question text-secondary' />
              <h2>{modalData.title}</h2>
              <p>{modalData.message}</p>

              <div className='d-flex justify-content-end' style={{ width: '100%' }}>
                <button type='button' className={`btn btn-danger mr-2`} onClick={abortModal}>
                  {modalData.abortButtonText}
                </button>
                <button type='button' className={`btn btn-success`} onClick={confirmModal}>
                  {modalData.confirmButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmationModal
