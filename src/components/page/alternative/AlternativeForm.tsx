import { AxiosError } from 'axios'
import { Pengajuan } from 'pages/dashboard/alternative'
import React from 'react'
import { useForm } from 'react-hook-form'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'

interface Props {
  pengajuan?: Pengajuan
  setPengajuan?: (data: Pengajuan) => void
}
const AlternativeForm: React.FC<Props> = ({ pengajuan, setPengajuan }) => {
  const { register, handleSubmit, formState, reset: resetForm } = useForm<Pengajuan>()
  const { errors } = formState
  const { authReq } = useRequest()
  const dispatch = useAppDispatch()

  const onSubmit = handleSubmit(data => {
    const mode = pengajuan ? 'update' : 'add'
    const method = mode == 'add' ? 'POST' : 'PUT'
    const url = `${API_ENDPOINT}/api/pengajuan` + (mode == 'add' ? '' : '/' + pengajuan?._id)
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Pengajuan }>({
      method,
      url,
      data,
    })
      .then(res => {
        setPengajuan?.(res.data.data)
        dispatch(
          ReducerActions.ui.setStatusModal({
            type: 'success',
            title: 'Success',
            message: mode === 'update' ? 'Update data success' : 'Tambah data success',
          })
        )
        if (mode === 'add') resetForm()
      })
      .catch((err: AxiosError) => {
        dispatch(ReducerActions.ui.setStatusModal({ type: 'error', title: 'Oops', message: err.response?.data.data }))
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  })

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Nama :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Nama...'
              defaultValue={pengajuan?.nama || ''}
              {...register('nama', { required: true })}
            />
            {errors.nama && <small className='form-text text-danger'>Mohon isi nama dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Alamat :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Alamat...'
              defaultValue={pengajuan?.alamat || ''}
              {...register('alamat', { required: true })}
            />
            {errors.alamat && <small className='form-text text-danger'>Mohon isi alamat dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Jenis Kelamin :</div>
          <div className='col-8 text-left p-3'>
            <select
              className='custom-select'
              defaultValue={pengajuan?.jenisKelamin}
              {...register('jenisKelamin', { required: true, validate: value => !!value })}>
              <option value=''>Jenis Kelamin...</option>
              <option value='laki'>Laki laki</option>
              <option value='perempuan'>Perempuan</option>
            </select>
            {errors.jenisKelamin && (
              <small className='form-text text-danger'>Mohon isi jenis kelamin dengan benar</small>
            )}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Kondisi Rumah :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='number'
              defaultValue={pengajuan?.kondisiRumah}
              className='form-control'
              placeholder='Kondisi rumah...'
              {...register('kondisiRumah', { required: true })}
            />
            {errors.kondisiRumah && (
              <small className='form-text text-danger'>Mohon isi kondisi rumah dengan benar</small>
            )}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Luas Tanah :</div>
          <div className='col-8 text-left p-3'>
            <div className='input-group'>
              <input
                type='number'
                defaultValue={pengajuan?.luasTanah}
                className='form-control'
                placeholder='Luas tanah...'
                {...register('luasTanah', { required: true })}
              />
              <div className='input-group-append'>
                <span className='input-group-text' id='basic-addon2'>
                  are
                </span>
              </div>
            </div>
            {errors.luasTanah && <small className='form-text text-danger'>Mohon isi luas tanah dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Pekerjaan :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='text'
              className='form-control'
              defaultValue={pengajuan?.pekerjaan}
              placeholder='Pekerjaan...'
              {...register('pekerjaan', { required: true })}
            />
            {errors.pekerjaan && <small className='form-text text-danger'>Mohon isi pekerjaan dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Penghasilan :</div>
          <div className='col-8 text-left p-3'>
            <div className='input-group'>
              <div className='input-group-append'>
                <span className='input-group-text' id='basic-addon2'>
                  Rp
                </span>
              </div>
              <input
                type='text'
                className='form-control'
                placeholder='Penghasilan...'
                defaultValue={pengajuan?.penghasilan}
                {...register('penghasilan', { required: true })}
              />
              <div className='input-group-append'>
                <span className='input-group-text' id='basic-addon2'>
                  / bulan
                </span>
              </div>
            </div>
            {errors.penghasilan && <small className='form-text text-danger'>Mohon isi penghasilan dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Umur :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='number'
              className='form-control'
              placeholder='Umur...'
              defaultValue={pengajuan?.umur}
              {...register('umur', { required: true })}
            />
            {errors.umur && <small className='form-text text-danger'>Mohon isi usia dengan benar</small>}
          </div>
        </div>
        <div className='row align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Status :</div>
          <div className='col-8 text-left p-3'>
            <select
              className='custom-select'
              defaultValue={pengajuan?.status}
              {...register('status', { required: true, validate: value => !!value })}>
              <option value=''>Status...</option>
              <option value='single'>Single</option>
              <option value='married'>Married</option>
            </select>
            {errors.status && <small className='form-text text-danger'>Mohon isi status dengan benar</small>}
          </div>
        </div>
        <div className='d-flex justify-content-end p-3'>
          <button className='btn btn-success' type='submit'>
            {pengajuan ? 'Update' : 'Tambah'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AlternativeForm
