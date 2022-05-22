import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const TopsisConfig = () => {
  const result = (data: { banjar?: string }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result`,
    params: data,
  })

  const resultDetail = (params?: { banjar?: string; year?: string }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result-detail`,
    params,
  })

  const topsisReport = (params?: { banjar?: string; year?: string }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/result-report`,
    responseType: 'arraybuffer',
    headers: {
      'Content-disposition': 'attachment; filename=tutorials.xlsx',
      'Content-Type': 'blob',
    },
    params,
  })

  return { result, resultDetail, topsisReport }
}

export default TopsisConfig()
