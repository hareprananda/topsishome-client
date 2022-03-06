import React, { useEffect, useRef, useState } from 'react'

interface Props {
  open: boolean
  title: string
  size: 'sm' | 'lg'
  setOpen: (open: boolean) => void
}

const Modal: React.FC<Props> = ({ open, title, children, size, setOpen }) => {
  const [modalId, setModalId] = useState<string>('')
  const isInitial = useRef(true)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setModalId(`modal-${Math.floor(Math.random() * Math.pow(10, 8))}`)
  }, [])

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    buttonRef.current?.click()
  }, [open])

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        data-toggle="modal"
        data-target={`#${modalId}`}
        style={{ display: 'none' }}
      />

      <div className="modal fade" id={modalId} tabIndex={-1} role="dialog" aria-hidden="true">
        <div className={`modal-dialog modal-${size}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={() => setOpen(!open)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(!open)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
