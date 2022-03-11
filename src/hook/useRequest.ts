import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'

interface DefaultRes {
  data: string
}

const useRequest = () => {
  const authReq = () => null
  const req = <T = DefaultRes>(config: AxiosRequestConfig) => {
    const mantap: AxiosPromise<T> = axios(config)
    return mantap
  }

  return { authReq, req }
}

export default useRequest
