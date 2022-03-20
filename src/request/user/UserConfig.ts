import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'
import { User } from './User.model'

const UserConfig = () => {
  const get = (): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/users`,
  })

  const updateStatus = (id: string, data: { level: User['level'] }): AxiosRequestConfig => ({
    url: `${API_ENDPOINT}/api/user/${id}`,
    method: 'PUT',
    data,
  })

  return { get, updateStatus }
}

export default UserConfig()
