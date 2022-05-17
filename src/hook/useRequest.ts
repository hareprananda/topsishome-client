import axios, { AxiosPromise, AxiosRequestConfig, AxiosError } from 'axios'
import LocalStorage from 'src/helper/LocalStorage'
import { useRouter } from 'next/router'
import { Route } from 'src/const/Route'

interface DefaultRes {
  data: string
}

const useRequest = () => {
  const router = useRouter()

  const authReq = <T = DefaultRes>(config: AxiosRequestConfig) => {
    const accessToken = LocalStorage.get('user')?.access_token
    return axios({
      ...config,
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(res => res)
      .catch((err: AxiosError) => {
        if (err.response?.status === 401 && router.pathname !== Route.Login) {
          LocalStorage.clear('user')
          router.push(Route.Login)
        }
        throw err
      }) as AxiosPromise<T>
  }

  const req = <T = DefaultRes>(config: AxiosRequestConfig) => {
    return axios(config) as AxiosPromise<T>
  }

  return { authReq, req }
}

export default useRequest
