import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const BanjarConfig = () => {
  const get = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/banjar`,
  })

  const update = (payload: { nama: string }, id: string): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/banjar/${id}`,
    method: 'PUT',
    data: payload,
  })

  const remove = (params: { id: string }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/banjar/${params.id}`,
    method: 'DELETE',
  })

  const store = (payload: { nama: string }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/banjar`,
    method: 'POST',
    data: payload,
  })

  return { get, update, remove, store }
}

export default BanjarConfig()
