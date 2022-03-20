import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const TopsisConfig = () => {
  const result = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result`,
  })

  const resultDetail = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result-detail`,
  })

  return { result, resultDetail }
}

export default TopsisConfig()
