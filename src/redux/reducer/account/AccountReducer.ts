import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import AccountReducerState from './AccountReducer.state'

const AccountReducer = createSlice({
  name: 'account',
  initialState: AccountReducerState,
  reducers: {
    setAccount: (state, action: PayloadAction<Partial<typeof AccountReducerState>>) => {
      state = { ...state, ...action.payload }
      return state
    },
  },
})

export default AccountReducer
