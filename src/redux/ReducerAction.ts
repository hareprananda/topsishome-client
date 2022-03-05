import { KeyRegisterReducer, TReducerObject } from './type'
import RegisterReducer from './RegisterReducer'

const ReducerActions = (Object.keys(RegisterReducer) as KeyRegisterReducer[]).reduce((acc, v) => {
  acc[v] = RegisterReducer[v]['actions']
  return acc
}, {} as Record<string, any>) as TReducerObject<'actions'>

export default ReducerActions
