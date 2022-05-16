import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { API_ENDPOINT } from 'src/const/Global'
import { useAppDispatch } from 'src/hook/useRedux'
import useRequest from 'src/hook/useRequest'
import ReducerActions from 'src/redux/ReducerAction'
import { Criteria } from 'request/criteria/Criteria.model'
import CriteriaConfig from 'src/request/criteria/CriteriaConfig'
import BanjarConfig from 'src/request/banjar/BanjarConfig'
import { Banjar } from 'src/request/banjar/Banjar.model'

export interface PengajuanDetail {
  _id: string
  alamat: string
  status: string
  jenisKelamin: string
  idBanjar: string
  namaBanjar: string
  umur: number
  pekerjaan: string
  nama: string
  criteria: {
    id: string
    name: string
    value: number
  }[]
}
interface Props {
  pengajuan?: PengajuanDetail
  setPengajuan?: (data: PengajuanDetail) => void
}

const AlternativeForm: React.FC<Props> = ({ pengajuan, setPengajuan }) => {
  const { register, handleSubmit, formState, reset: resetForm } = useForm<Record<string, any>>()
  const { errors } = formState
  const { authReq } = useRequest()
  const dispatch = useAppDispatch()
  const [allCriteria, setAllCriteria] = useState<(Omit<Criteria, '_id'> & { id: string })[]>([])
  const [banjarList, setBanjarList] = useState<Banjar[]>([])

  const onSubmit = handleSubmit(data => {
    const mode = pengajuan ? 'update' : 'add'
    const method = mode == 'add' ? 'POST' : 'PUT'
    const url = `${API_ENDPOINT}/api/pengajuan` + (mode == 'add' ? '' : '/' + pengajuan?._id)
    const { nama, alamat, jenisKelamin, pekerjaan, status, umur, idBanjar, ...criteria } = data
    const criteriaPayload = Object.keys(criteria).map(key => ({
      id: key.replace(/^criteria/g, ''),
      value: data[key],
    }))
    const payload = {
      nama,
      alamat,
      jenisKelamin,
      pekerjaan,
      status,
      umur,
      idBanjar,
      criteria: criteriaPayload,
    }

    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: PengajuanDetail }>({
      method,
      url,
      data: payload,
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

  useEffect(() => {
    if (pengajuan === undefined) {
      authReq<{ data: Criteria[] }>(CriteriaConfig.get()).then(res => {
        setAllCriteria(res.data.data.map(({ _id, bobot, keterangan, name }) => ({ id: _id, bobot, keterangan, name })))
      })
    }
    if (!pengajuan || Object.keys(pengajuan).length === 0) return
    const { nama, alamat, jenisKelamin, pekerjaan, status, umur, criteria, idBanjar } = pengajuan
    const criteriaForm = criteria.reduce((acc, cr) => {
      acc[`criteria${cr.id}`] = cr.value
      return acc
    }, {} as Record<string, number>)
    setTimeout(() => {
      resetForm({
        nama,
        idBanjar,
        alamat,
        jenisKelamin,
        pekerjaan,
        status,
        umur,
        ...criteriaForm,
      })
    }, 100)
  }, [pengajuan])

  useEffect(() => {
    authReq<{ data: Banjar[] }>(BanjarConfig.get())
      .then(res => {
        setBanjarList(res.data.data)
      })
      .catch(() => null)
  }, [])
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h4 className='text-left'>Informasi Personal</h4>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Nama :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Nama...'
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
              {...register('alamat', { required: true })}
            />
            {errors.alamat && <small className='form-text text-danger'>Mohon isi alamat dengan benar</small>}
          </div>
        </div>
        <div className='row align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Banjar :</div>
          <div className='col-8 text-left p-3'>
            <select className='custom-select' {...register('idBanjar', { required: true, validate: value => !!value })}>
              <option value=''>Banjar...</option>
              {banjarList.map((v, k) => (
                <option key={k} value={v._id}>
                  {v.nama}
                </option>
              ))}
            </select>
            {errors.status && <small className='form-text text-danger'>Mohon isi status dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Jenis Kelamin :</div>
          <div className='col-8 text-left p-3'>
            <select
              className='custom-select'
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
          <div className='col-4 text-left p-3 font-weight-bold'>Pekerjaan :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Pekerjaan...'
              {...register('pekerjaan', { required: true })}
            />
            {errors.pekerjaan && <small className='form-text text-danger'>Mohon isi pekerjaan dengan benar</small>}
          </div>
        </div>
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Umur :</div>
          <div className='col-8 text-left p-3'>
            <input
              type='number'
              className='form-control'
              placeholder='Umur...'
              {...register('umur', { required: true })}
            />
            {errors.umur && <small className='form-text text-danger'>Mohon isi usia dengan benar</small>}
          </div>
        </div>
        <div className='row align-middle' style={{ alignItems: 'center' }}>
          <div className='col-4 text-left p-3 font-weight-bold'>Status :</div>
          <div className='col-8 text-left p-3'>
            <select className='custom-select' {...register('status', { required: true, validate: value => !!value })}>
              <option value=''>Status...</option>
              <option value='single'>Single</option>
              <option value='married'>Married</option>
            </select>
            {errors.status && <small className='form-text text-danger'>Mohon isi status dengan benar</small>}
          </div>
        </div>
        <h4 className='text-left mt-4'>Informasi Kriteria</h4>
        {(pengajuan ? pengajuan?.criteria : allCriteria)?.map(criteria => (
          <div className='row border-bottom align-middle' style={{ alignItems: 'center' }} key={criteria.id}>
            <div className='col-4 text-left p-3 font-weight-bold'>{criteria.name} :</div>
            <div className='col-8 text-left p-3'>
              <input
                type='number'
                className='form-control'
                placeholder={criteria.name + '...'}
                {...register(`criteria${criteria.id}`, { required: true })}
              />
              {errors[`criteria${criteria.id}`] && (
                <small className='form-text text-danger'>Mohon isi {criteria.name} dengan benar</small>
              )}
            </div>
          </div>
        ))}
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
