import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import LocalStorage from 'src/helper/LocalStorage'

interface DefaultRes {
  data: string
}

const useRequest = () => {
  const authReq = <T = DefaultRes>(config: AxiosRequestConfig) => {
    const accessToken = LocalStorage.get('user').access_token
    return axios({
      ...config,
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }) as AxiosPromise<T>
  }
  const req = <T = DefaultRes>(config: AxiosRequestConfig) => {
    return axios(config) as AxiosPromise<T>
  }

  return { authReq, req }
}

export default useRequest
