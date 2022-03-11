import React, { useState } from 'react'
import { NextPage } from 'next'
import withAuthLayout from 'src/components/layout/AuthLayout'
import Link from 'next/link'
import { Route } from 'src/const/Route'

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div>
      <h1>Sign In</h1>

      <div className='auth__form-group form-group'>
        <label htmlFor='nik'>NIK</label>
        <input type='text' id='nik' className='form-control' placeholder='NIP...' />
      </div>
      <div className='auth__form-group form-group'>
        <label htmlFor='password'>Password</label>
        <div className='input-group mb-3'>
          <input type={showPassword ? 'text' : 'password'} className='form-control' placeholder='Password' />
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
    </div>
  )
}

export default Login
withAuthLayout(Login)
