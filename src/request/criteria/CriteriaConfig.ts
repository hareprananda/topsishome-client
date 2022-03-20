import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const CriteriaConfig = () => {
  const get = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/criteria`,
  })

  return { get }
}

export default CriteriaConfig()
