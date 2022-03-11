import Link from 'next/link'
import React, { useState } from 'react'
import withAuthLayout from 'src/components/layout/AuthLayout'
import { Route } from 'src/const/Route'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import { NextPageWithLayout } from './_app'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import useRequest from 'src/hook/useRequest'
import { API_ENDPOINT } from 'src/const/Global'
import { useRouter } from 'next/router'

interface Form {
  id: string
  name: string
  password: string
  passwordConfirmation: string
}

const Register: NextPageWithLayout = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { req } = useRequest()
  const { register, formState, watch, handleSubmit } = useForm<Form>()
  const { errors } = formState
  const form = watch()

  const submitRegister = handleSubmit(data => {
    dispatch(ReducerActions.ui.masterLoader(true))
    setLoading(true)
    setServerError('')
    req({
      url: `${API_ENDPOINT}/api/auth/register`,
      method: 'POST',
      data,
    })
      .then(() => {
        dispatch(
          ReducerActions.ui.setStatusModal({
            title: 'Success',
            message: 'Register sukses, mohon melakukan login',
            type: 'success',
          })
        )
        router.push(Route.Login)
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
        setLoading(false)
      })
  })
  return (
    <div>
      <h1>Register</h1>
      {serverError && (
        <p className='auth__error-text' style={{ marginTop: '14px' }}>
          {serverError}
        </p>
      )}
      <form onSubmit={submitRegister}>
        <div className='auth__form-group form-group'>
          <label htmlFor='id'>NIP</label>
          <input
            type='text'
            id='id'
            className='form-control mb-3'
            {...register('id', { required: true })}
            placeholder='NIP...'
          />
          {errors.id && <p className='auth__error-text'>Mohon isi ID dengan benar</p>}
        </div>
        <div className='auth__form-group form-group'>
          <label htmlFor='nama'>Nama</label>
          <input
            type='text'
            id='nama'
            className='form-control mb-3'
            {...register('name', { required: true })}
            placeholder='Nama...'
          />
          {errors.name && <p className='auth__error-text'>Mohon isi nama anda dengan benar</p>}
        </div>
        <div className='auth__form-group form-group'>
          <label htmlFor='password'>Password</label>
          <div className='input-group mb-3'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control'
              {...register('password', { required: true, minLength: 8 })}
              name='password'
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
          {errors.password && <p className='auth__error-text'>Mohon isi password dengan benar</p>}
        </div>
        <div className='auth__form-group form-group'>
          <label htmlFor='password'>Konfirmasi Password</label>
          <div className='input-group mb-3'>
            <input
              type={showConfirmationPassword ? 'text' : 'password'}
              className='form-control'
              {...register('passwordConfirmation', { required: true, validate: val => val === form.password })}
              name='passwordConfirmation'
              placeholder='Konfirmasi Password'
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-light'
                type='button'
                onClick={() => setShowConfirmationPassword(current => !current)}>
                <i className={showConfirmationPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              </button>
            </div>
          </div>
          {errors.passwordConfirmation && <p className='auth__error-text'>Konfirmasi password salah</p>}
        </div>

        <button
          type='submit'
          disabled={Object.keys(errors).length > 0 || loading}
          className='btn btn-primary btn-lg btn-block'>
          Register
        </button>
        <Link href={Route.Login}>
          <a className='btn btn-light btn-lg btn-block'>Login</a>
        </Link>
      </form>
    </div>
  )
}

export default Register
withAuthLayout(Register)
