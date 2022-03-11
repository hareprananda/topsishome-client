import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import UIReducerState from './UIReducer.state'

type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

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
  },
})

export default UIReducer
