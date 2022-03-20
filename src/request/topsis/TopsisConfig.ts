import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const TopsisConfig = () => {
  const result = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result`,
  })

  return { result }
}

export default TopsisConfig()
