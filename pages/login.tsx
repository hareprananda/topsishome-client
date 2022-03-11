import React, { useState } from 'react'
import { NextPage } from 'next'
import withAuthLayout from 'src/components/layout/AuthLayout'
import Link from 'next/link'
import { Route } from 'src/const/Route'
import { useForm } from 'react-hook-form'
import useRequest from 'src/hook/useRequest'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import LocalStorage from 'src/helper/LocalStorage'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'

interface Form {
  id: string
  password: string
}

interface LoginResponse {
  data: {
    access_token: string
    refresh_token: string
  }
}

const Login: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<Form>()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const dispatch = useAppDispatch()
  const { req } = useRequest()
  const onSubmit = handleSubmit(data => {
    dispatch(ReducerActions.ui.masterLoader(true))
    req<LoginResponse>({
      url: `${API_ENDPOINT}/api/auth/login`,
      method: 'POST',
      data: data,
    })
      .then(res => {
        LocalStorage.save('user', res.data.data)
        router.push(Route.Home)
      })
      .catch((err: AxiosError<{ data: string }>) => {
        if ([404, 500].includes(err.response?.status as number))
          return dispatch(
            ReducerActions.ui.setStatusModal({
              title: 'Oops',
              message: 'Something gone wrong',
              type: 'error',
            })
          )
        setServerError(err.response?.data.data as string)
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  })
  return (
    <div>
      <h1>Sign In</h1>
      {serverError && (
        <p className='auth__error-text' style={{ marginTop: '14px' }}>
          {serverError}
        </p>
      )}
      <form onSubmit={onSubmit}>
        <div className='auth__form-group form-group'>
          <label htmlFor='nip'>NIP</label>
          <input type='text' id='nip' className='form-control' {...register('id')} placeholder='NIP...' />
        </div>
        <div className='auth__form-group form-group'>
          <label htmlFor='password'>Password</label>
          <div className='input-group mb-3'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control'
              {...register('password')}
              placeholder='Password'
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-light'
                type='button'
                onClick={() => setShowPassword(current => !current)}>
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              </button>
            </div>
          </div>
        </div>

        <button type='submit' className='btn btn-primary btn-lg btn-block'>
          Sign In
        </button>
        <Link href={Route.Register}>
          <a className='btn btn-light btn-lg btn-block'>Register</a>
        </Link>
      </form>
    </div>
  )
}

export default Login
withAuthLayout(Login)
