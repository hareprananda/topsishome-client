import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import UIReducerState from './UIReducer.state'

type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

type RequiredOnPartial<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

const UIReducer = createSlice({
  name: 'ui',
  initialState: UIReducerState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    masterLoader: (state, action: PayloadAction<boolean>) => {
      state.masterLoader = action.payload
    },
    setStatusModal: (
      state,
      action: PayloadAction<PartialPick<typeof UIReducerState['statusModal'], 'buttonText' | 'onClick'>>
    ) => {
      state.statusModal = { ...state.statusModal, ...action.payload }
      return state
    },
    setConfirmationmodal: (
      state,
      action: PayloadAction<RequiredOnPartial<typeof UIReducerState['confirmationModal'], 'message' | 'title'>>
    ) => {
      const { payload } = action
      state.confirmationModal = {
        abortButtonText: payload.abortButtonText || 'Cancel',
        confirmButtonText: payload.confirmButtonText || 'Ok',
        message: payload.message,
        onAbort: payload.onAbort || (() => null),
        onConfirm: payload.onConfirm || (() => null),
        title: payload.title,
      }
    },
  },
})

export default UIReducer
