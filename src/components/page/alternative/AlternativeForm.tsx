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
import { houseCondition } from './AlternativeDetail'

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
    year: string
    criteria: {
      id: string
      name: string
      value: number
    }[]
  }[]
}
interface Props {
  pengajuan?: PengajuanDetail
  setPengajuan?: (data: PengajuanDetail) => void
}

const AlternativeForm: React.FC<Props> = ({ pengajuan, setPengajuan }) => {
  const { register, handleSubmit, formState, reset: resetForm, resetField } = useForm<Record<string, any>>()
  const { errors } = formState
  const { authReq } = useRequest()
  const dispatch = useAppDispatch()
  const [allCriteria, setAllCriteria] = useState<(Omit<Criteria, '_id'> & { id: string })[]>([])
  const [banjarList, setBanjarList] = useState<Banjar[]>([])
  const [isNewForm, setIsNewForm] = useState(!pengajuan)

  const onSubmit = handleSubmit(data => {
    const mode = pengajuan ? 'update' : 'add'
    const method = mode == 'add' ? 'POST' : 'PUT'
    const url = `${API_ENDPOINT}/api/pengajuan` + (mode == 'add' ? '' : '/' + pengajuan?._id)
    const { nama, alamat, jenisKelamin, pekerjaan, status, umur, idBanjar, newYear, ...criteria } = data
    const newPayload: { id: string; year: string; value: string }[] = []
    let criteriaPayload = Object.keys(criteria)
      .filter(key => {
        const isNew = /^new-criteria/g.test(key)
        if (isNew) newPayload.push({ id: key.replace(/new-criteria/g, ''), year: newYear, value: data[key] })
        return !isNew
      })
      .map(key => ({
        id: key.replace(/(^criteria)|(-\d+$)/g, ''),
        year: key.slice(key.length - 4, key.length),
        value: data[key],
      }))

    if (isNewForm) criteriaPayload = criteriaPayload.concat(newPayload)
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
        if (isNewForm) newPayload.forEach(v => resetField(`new-criteria${v.id}`))
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
      cr.criteria.forEach(v => {
        acc[`criteria${v.id}-${cr.year}`] = v.value
      })
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
        <div className='row border-bottom align-middle' style={{ alignItems: 'center' }}>
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
        <nav>
          <div className='nav nav-tabs' id='nav-tab' role='tablist'>
            {pengajuan?.criteria?.map((cr, key) => (
              <a
                key={key}
                className={`nav-link ${key === 0 && !isNewForm ? 'active' : ''}`}
                id={`year-tab-${cr.year}`}
                onClick={() => setIsNewForm(false)}
                data-toggle='tab'
                href={`#nav-tab${cr.year}`}
                role='tab'
                aria-controls='nav-home'
                aria-selected='true'>
                {cr.year}
              </a>
            ))}
            <a
              className={`nav-link ${isNewForm ? 'active' : ''}`}
              onClick={() => setIsNewForm(true)}
              id={`new-tab`}
              data-toggle='tab'
              href={`#new-tab-form`}
              role='tab'
              aria-controls='nav-home'
              aria-selected='true'>
              <i className='fas fa-plus text-primary' /> <span className='text-primary'> New</span>
            </a>
          </div>
        </nav>
        <div className='tab-content' id='nav-tabContent'>
          {!isNewForm &&
            pengajuan?.criteria?.map((cr, key) => (
              <div
                key={key}
                className={`tab-pane fade ${key === 0 ? 'show active' : ''}`}
                id={`nav-tab${cr.year}`}
                role='tabpanel'
                aria-labelledby='nav-home-tab'>
                {(pengajuan ? cr?.criteria : allCriteria)?.map(criteria => (
                  <div className='row border-bottom align-middle' style={{ alignItems: 'center' }} key={criteria.id}>
                    <div className='col-4 text-left p-3 font-weight-bold'>{criteria.name} :</div>
                    <div className='col-8 text-left p-3'>
                      {criteria.name.toLowerCase() === 'kondisi rumah' ? (
                        <select
                          className='custom-select'
                          {...register(`criteria${criteria.id}-${cr.year}`, { required: true })}>
                          {houseCondition.map((v, idx) => (
                            <option key={idx} value={idx + 1}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className='input-group'>
                          {criteria.name === 'Penghasilan' && (
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>Rp</div>
                            </div>
                          )}
                          <input
                            type='number'
                            className='form-control'
                            placeholder={criteria.name + '...'}
                            {...register(`criteria${criteria.id}-${cr.year}`, { required: true })}
                          />
                          {['Luas Tanah', 'Menerima Bantuan'].includes(criteria.name) && (
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>{criteria.name === 'Luas Tanah' ? 'm2' : 'kali'}</div>
                            </div>
                          )}
                        </div>
                      )}
                      {errors[`criteria${criteria.id}`] && (
                        <small className='form-text text-danger'>Mohon isi {criteria.name} dengan benar</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          {isNewForm && (
            <div
              className={`tab-pane fade ${isNewForm ? 'show active' : ''}`}
              id={`new-tab-form`}
              role='tabpanel'
              aria-labelledby='nav-home-tab'>
              <div className='row border-bottom'>
                <div className='col-4 text-left p-3 font-weight-bold'>Tahun :</div>
                <div className='col-8 text-left p-3'>
                  <select
                    {...register(`newYear`)}
                    defaultValue={''}
                    className='custom-select'
                    style={{ minWidth: '200px' }}>
                    {(() => {
                      const currentDate = new Date().getFullYear()
                      const optionEl: JSX.Element[] = []
                      for (let i = currentDate; i >= currentDate - 4; i--) {
                        if (pengajuan?.criteria?.find(v => v.year.toString() === i.toString())) continue
                        optionEl.push(
                          <option key={i} value={i}>
                            {i}
                          </option>
                        )
                      }
                      return optionEl
                    })()}
                  </select>
                </div>
              </div>
              {(pengajuan?.criteria[0].criteria || allCriteria).map(criteria => (
                <div className='row border-bottom' key={criteria.id}>
                  <div className='col-4 text-left p-3 font-weight-bold'>{criteria.name} :</div>
                  <div className='col-8 text-left p-3'>
                    {criteria.name.toLowerCase() === 'kondisi rumah' ? (
                      <select className='custom-select' {...register(`new-criteria${criteria.id}`, { required: true })}>
                        {houseCondition.map((v, idx) => (
                          <option key={idx} value={idx + 1}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className='input-group'>
                        {criteria.name === 'Penghasilan' && (
                          <div className='input-group-prepend'>
                            <div className='input-group-text'>Rp</div>
                          </div>
                        )}
                        <input
                          type='number'
                          className='form-control'
                          placeholder={criteria.name + '...'}
                          {...register(`new-criteria${criteria.id}`, { required: true })}
                        />
                        {['Luas Tanah', 'Menerima Bantuan'].includes(criteria.name) && (
                          <div className='input-group-prepend'>
                            <div className='input-group-text'>{criteria.name === 'Luas Tanah' ? 'm2' : 'kali'}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {errors[`new-criteria${criteria.id}`] && (
                      <small className='form-text text-danger'>Mohon isi {criteria.name} dengan benar</small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
