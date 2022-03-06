import AccountReducer from './reducer/account/AccountReducer'
import UIReducer from './reducer/ui/UIReducer'

const RegisterReducer = {
  ui: UIReducer,
  account: AccountReducer,
}

export default RegisterReducer
