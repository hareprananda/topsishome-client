import { NextPageWithLayout } from 'pages/_app'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch, useAppSelector } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { Criteria } from 'src/request/criteria/Criteria.model'
import CriteriaConfig from 'src/request/criteria/CriteriaConfig'

const Criteria: NextPageWithLayout = () => {
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([])
  const { authReq } = useRequest()
  const { register, handleSubmit, formState, reset: resetForm, setValue } = useForm<Criteria>({ mode: 'all' })
  const { errors } = formState
  const dispatch = useAppDispatch()
  const account = useAppSelector(state => state.account)
  const [mode, setMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Criteria'))
    fetchCriteria()
  }, [])

  const fetchCriteria = () => {
    authReq<{ data: Criteria[] }>(CriteriaConfig.get()).then(res => {
      setCriteriaList(res.data.data)
    })
  }

  const onSubmit = handleSubmit(data => {
    const url = API_ENDPOINT + (mode === 'add' ? '/api/criteria' : `/api/criteria/${data._id}`)
    const method = mode === 'add' ? 'POST' : 'PUT'
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Criteria }>({
      method,
      url,
      data: data,
    })
      .then(res => {
        setCriteriaList(currentValue => {
          const current = [...currentValue]
          if (mode === 'add') current.push(res.data.data)
          else {
            const updatedIndex = criteriaList.findIndex(criteria => criteria._id === data._id) as number
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
    const findCriteria = criteriaList.find(criteria => criteria._id === id)
    const settedCriteria: Criteria = {
      _id: findCriteria?._id || '',
      bobot: (findCriteria?.bobot || '') as unknown as number,
      keterangan: (findCriteria?.keterangan || '') as unknown as 'cost' | 'benefit',
      name: findCriteria?.name || '',
    }
    ;(Object.keys(settedCriteria) as (keyof Criteria)[]).forEach(criteriaKey => {
      setValue(criteriaKey, settedCriteria[criteriaKey])
    })
  }

  const onDeleteConfirmation = (id: string) => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq({
      url: `${API_ENDPOINT}/api/criteria/${id}`,
      method: 'DELETE',
    })
      .then(() => {
        setCriteriaList(current => current.filter(criteria => criteria._id !== id))
      })
      .catch(() => null)
      .finally(() => dispatch(ReducerActions.ui.masterLoader(false)))
  }

  const deleteConfirmation = (criteria: Criteria) => {
    dispatch(
      ReducerActions.ui.setConfirmationmodal({
        title: 'Are you sure?',
        message: 'Apakah anda yakin ingin menghapus kriteria ' + criteria.name,
        onConfirm: () => onDeleteConfirmation(criteria._id),
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
                  <th scope='col'>Bobot</th>
                  <th scope='col'>Keterangan</th>
                  {account.level === 'administrator' && <th scope='col'>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {criteriaList.map((criteria, idx) => (
                  <tr key={idx}>
                    <td>{criteria.name}</td>
                    <td>{criteria.bobot}</td>
                    <td>{criteria.keterangan}</td>
                    {account.level === 'administrator' && (
                      <td>
                        <div className='d-flex '>
                          <button
                            className='btn btn-warning text-white'
                            onClick={() => changeMode('edit', criteria._id)}>
                            <i className='fas fa-edit mr-1' /> Edit
                          </button>
                          <button
                            className='btn btn-danger text-white ml-2'
                            onClick={() => deleteConfirmation(criteria)}>
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
                <p className='m-0 font-weight-bold'>{mode.slice(0, 1).toUpperCase() + mode.slice(1)} Kriteria</p>
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
                  <label>Name</label>
                  <input
                    className='form-control'
                    placeholder='Masukkan nama'
                    {...register('name', { required: true })}
                  />
                  {errors.name && <small className='form-text text-danger'>Mohon isi nama dengan benar</small>}
                </div>
                <div className='form-group'>
                  <label>Keterangan</label>
                  <select
                    className='form-control'
                    {...register('keterangan', { required: true, validate: val => !!val })}>
                    <option value=''>Pilih Keterangan</option>
                    <option value='cost'>Cost</option>
                    <option value='benefit'>Benefit</option>
                  </select>
                  {errors.keterangan && <small className='form-text text-danger'>Mohon isi keterangan benar</small>}
                </div>
                <div className='form-group'>
                  <label>Bobot</label>
                  <select className='form-control' {...register('bobot', { required: true, validate: val => !!val })}>
                    <option value=''>Pilih bobot</option>
                    {[1, 2, 3, 4, 5].map(val => (
                      <option value={val} key={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  {errors.bobot && <small className='form-text text-danger'>Mohon isi bobot dengan benar</small>}
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

export default Criteria
withDashboardLayout(Criteria)
