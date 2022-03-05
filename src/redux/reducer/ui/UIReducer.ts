import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import UIReducerState from './UIReducer.state'

const UIReducer = createSlice({
  name: 'ui',
  initialState: UIReducerState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
  },
})

export default UIReducer
