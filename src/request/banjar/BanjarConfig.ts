import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const BanjarConfig = () => {
  const get = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/banjar`,
  })

  return { get }
}

export default BanjarConfig()
