import { NextPageWithLayout } from 'pages/_app'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { Banjar } from 'src/request/banjar/Banjar.model'
import BanjarConfig from 'src/request/banjar/BanjarConfig'

const Banjar: NextPageWithLayout = () => {
  const [banjarList, setBanjarList] = useState<Banjar[]>([])
  const { authReq } = useRequest()
  const { register, handleSubmit, formState, reset: resetForm, setValue } = useForm<Banjar>({ mode: 'all' })
  const { errors } = formState
  const account = useAppSelector(state => state.account)
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Banjar'))
    fetchBanjar()
  }, [])

  const fetchBanjar = () => {
    authReq<{ data: Banjar[] }>(BanjarConfig.get()).then(res => {
      setBanjarList(res.data.data)
    })
  }

  const onSubmit = handleSubmit(data => {
    const url = API_ENDPOINT + (mode === 'add' ? '/api/banjar' : `/api/banjar/${data._id}`)
    const method = mode === 'add' ? 'POST' : 'PUT'
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Banjar }>({
      method,
      url,
      data: data,
    })
      .then(res => {
        setBanjarList(currentValue => {
          const current = [...currentValue]
          if (mode === 'add') current.push(res.data.data)
          else {
            const updatedIndex = banjarList.findIndex(criteria => criteria._id === data._id) as number
            current[updatedIndex] = res.data.data
          }
          return current
        })
        resetForm()
        setMode('add')
      })
      .catch(() => {
        return dispatch(
          ReducerActions.ui.setStatusModal({
            title: 'Oops',
            message: 'Something gone wrong',
            type: 'error',
          })
        )
      })
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  })

  const changeMode = <T extends typeof mode>(mode: T, id = '') => {
    setMode(mode)
    const findBanjar = banjarList.find(criteria => criteria._id === id)
    const setterBanjar: Banjar = {
      _id: findBanjar?._id || '',
      nama: findBanjar?.nama || '',
    }
    ;(Object.keys(setterBanjar) as (keyof Banjar)[]).forEach(criteriaKey => {
      setValue(criteriaKey, setterBanjar[criteriaKey])
    })
  }

  const onDeleteConfirmation = (id: string) => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq(BanjarConfig.remove({ id }))
      .then(() => {
        setBanjarList(current => current.filter(criteria => criteria._id !== id))
      })
      .catch(() => null)
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  const deleteConfirmation = (banjar: Banjar) => {
    dispatch(
      ReducerActions.ui.setConfirmationmodal({
        title: 'Apakah you sure ?',
        message: `Dengan menghapus banjar ${banjar.nama} maka anda akan menghapus semua alternatif yang ada dalam banjar ${banjar.nama}`,
        onConfirm: () => onDeleteConfirmation(banjar._id),
      })
    )
  }

  return (
    <div className='row'>
      <div className={`${account.level === 'user' ? 'col-12' : 'col-8'} pr-2`}>
        <div className='card'>
          <div className='card-body'>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Name</th>
                  {account.level === 'administrator' && <th scope='col'>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {banjarList.map((banjar, idx) => (
                  <tr key={idx}>
                    <td>{banjar.nama}</td>
                    {account.level === 'administrator' && (
                      <td>
                        <div className='d-flex '>
                          <button className='btn btn-warning text-white' onClick={() => changeMode('edit', banjar._id)}>
                            <i className='fas fa-edit mr-1' /> Edit
                          </button>
                          <button className='btn btn-danger text-white ml-2' onClick={() => deleteConfirmation(banjar)}>
                            {' '}
                            <i className='fas fa-trash mr-1' />
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {account.level === 'administrator' && (
        <div className='col-4 pl-2'>
          <div className='card '>
            <div className='card-header'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className='m-0 font-weight-bold'>{mode.slice(0, 1).toUpperCase() + mode.slice(1)} Banjar</p>
                {mode === 'edit' && (
                  <button className='btn btn-outline-secondary' onClick={() => changeMode('add')}>
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className='card-body'>
              <form onSubmit={onSubmit}>
                <div className='form-group'>
                  <label>Nama Banjar</label>
                  <input
                    className='form-control'
                    placeholder='Masukkan nama banjar'
                    {...register('nama', { required: true })}
                  />
                  {errors.nama && <small className='form-text text-danger'>Mohon isi nama banjar dengan benar</small>}
                </div>

                <button type='submit' className={`btn ${mode === 'add' ? 'btn-primary' : 'btn-success'} btn-block `}>
                  {mode === 'add' ? 'Tambah' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Banjar
withDashboardLayout(Banjar)
