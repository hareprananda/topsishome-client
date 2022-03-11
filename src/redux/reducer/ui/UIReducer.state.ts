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
}

export default UIReducerState
