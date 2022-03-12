const UIReducerState = {
  title: '',
  masterLoader: false,
  statusModal: {
    title: '',
    message: '',
    type: 'success' as 'error' | 'success',
    buttonText: 'Ok',
    onClick: () => null,
  },
  confirmationModal: {
    title: '',
    message: '',
    confirmButtonText: 'Ok',
    abortButtonText: 'Cancel',
    onConfirm: (() => null) as () => any,
    onAbort: (() => null) as () => any,
  },
}

export default UIReducerState
