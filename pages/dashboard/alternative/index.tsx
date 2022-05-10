import React, { useEffect, useRef, useState } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import useRequest from 'src/hook/useRequest'
import { API_ENDPOINT } from 'src/const/Global'
import { Pagination } from 'src/types/Global'
import Link from 'next/link'
import { Route } from 'src/const/Route'
import Modal from 'src/components/modal/Modal'
import { AxiosError } from 'axios'

export interface SinglePengajuanList {
  _id: string
  alamat: string
  status: string
  jenisKelamin: 'laki' | 'perempuan'
  umur: number
  kondisiRumah: number
  luasTanah: number
  penghasilan: number
  pekerjaan: string
  nama: string
}

const Alternative: NextPageWithLayout = () => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  const [alternativeList, setAlternativeList] = useState<SinglePengajuanList[]>([])
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    maxPage: 1,
    dataPerPage: 1,
  })
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')

  useEffect(() => {
    if (!openUploadModal) {
      if (inputFileRef.current) inputFileRef.current.value = ''
      setUploadedFileName('')
    }
  }, [openUploadModal])

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Alternatif'))
  }, [])

  useEffect(() => {
    fetchAlternative()
  }, [metaData.currentPage])

  const fetchAlternative = () => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Pagination<SinglePengajuanList[]> }>({
      method: 'GET',
      url: API_ENDPOINT + '/api/pengajuan',
      params: {
        page: metaData.currentPage,
      },
    })
      .then(res => {
        setAlternativeList(res.data.data.data)
        setMetaData({
          currentPage: res.data.data.meta.currentPage,
          maxPage: res.data.data.meta.numberOfPage,
          dataPerPage: res.data.data.meta.dataPerPage,
        })
      })
      .catch(() => {
        dispatch(
          ReducerActions.ui.setStatusModal({
            title: 'Oops',
            message: 'Something gone wrong',
            type: 'error',
          })
        )
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }

  const paginationButton = () => {
    const paginationButtons: JSX.Element[] = []
    for (let i = 0; i < metaData.maxPage; i++) {
      paginationButtons.push(
        <li
          className={`page-item ${metaData.currentPage === i + 1 ? 'disabled' : ''}`}
          key={i}
          style={{ cursor: 'pointer' }}>
          <div className='page-link' onClick={() => setMetaData(current => ({ ...current, currentPage: i + 1 }))}>
            {i + 1}
          </div>
        </li>
      )
    }
    return paginationButtons
  }

  const onDelete = (id: string) => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq({
      method: 'DELETE',
      url: API_ENDPOINT + `/api/pengajuan/${id}`,
    }).finally(() => {
      fetchAlternative()
      dispatch(ReducerActions.ui.masterLoader(false))
    })
  }

  const deleteConfirmation = (pengajuan: SinglePengajuanList) => {
    dispatch(
      ReducerActions.ui.setConfirmationmodal({
        title: 'Are you sure?',
        message: `Apakah anda yakin ingin menghapus pengajuan ${pengajuan.nama} ?`,
        onConfirm: () => onDelete(pengajuan._id),
      })
    )
  }

  const submitFile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('alternative', fileRef.current as File)
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq({
      method: 'POST',
      url: API_ENDPOINT + '/api/upload/users',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
      .then(() => {
        dispatch(
          ReducerActions.ui.setStatusModal({ type: 'success', title: 'Success', message: 'File Successfully uploaded' })
        )
        setOpenUploadModal(false)
      })
      .catch((err: AxiosError) => {
        if (inputFileRef.current) inputFileRef.current.value = ''
        setUploadedFileName('')
        dispatch(ReducerActions.ui.setStatusModal({ type: 'error', title: 'Oops', message: err.response?.data.data }))
      })
      .finally(() => {
        dispatch(ReducerActions.ui.masterLoader(false))
      })
  }
  const fileRef = useRef<File>()

  const changeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const split = file.name.split('.')
    const extension = split[split.length - 1]
    if (extension !== 'xlsx') {
      dispatch(ReducerActions.ui.setStatusModal({ message: 'Wrong file extension', title: 'Oops', type: 'error' }))
      if (inputFileRef.current) inputFileRef.current.value = ''
      return
    }
    fileRef.current = file
    setUploadedFileName(file.name)
  }

  return (
    <div className='card'>
      <div className='card-header d-flex justify-content-end'>
        <Link href={Route.AlternativeAdd}>
          <a className='btn btn-success d-flex' style={{ alignItems: 'center' }}>
            <i className='fas fa-plus' />
            <p className='m-0 ml-2'>Tambah Alternatif</p>
          </a>
        </Link>

        <button
          className='btn btn-primary d-flex ml-1'
          onClick={() => setOpenUploadModal(true)}
          style={{ alignItems: 'center' }}>
          <i className='fas fa-upload' />
          <p className='m-0 ml-2'>Upload Excel</p>
        </button>
      </div>
      <div className='card-body'>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Alamat</th>
              <th scope='col'>Umur</th>
              <th scope='col'>Jenis Kelamin</th>
              <th scope='col d-flex justify-content-end' style={{ textAlign: 'right' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {alternativeList.map((alternative, idx) => (
              <tr key={idx}>
                <td>{idx + 1 + metaData.dataPerPage * (metaData.currentPage - 1)}</td>
                <td>
                  <Link href={Route.AlternativeDetail(alternative._id)}>
                    <a className='text-primary'>{alternative.nama}</a>
                  </Link>
                </td>
                <td>{alternative.alamat}</td>
                <td>{alternative.umur}</td>
                <td>{alternative.jenisKelamin}</td>
                <td>
                  <div className='d-flex justify-content-end'>
                    <Link href={Route.AlternativeDetail(alternative._id) + '?edit=1'}>
                      <a className='btn btn-warning text-white'>
                        <i className='fas fa-edit mr-1' /> Edit
                      </a>
                    </Link>
                    <button className='btn btn-danger text-white ml-2' onClick={() => deleteConfirmation(alternative)}>
                      {' '}
                      <i className='fas fa-trash mr-1' />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='card-footer'>
        <nav aria-label='Page navigation example'>
          <ul className='pagination justify-content-center'>
            <li className={`page-item ${metaData.currentPage === 1 ? 'disabled' : ''}`}>
              <a className='page-link' href='#'>
                <i className='fas fa-chevron-left'></i>
              </a>
            </li>
            {paginationButton()}
            <li className={`page-item ${metaData.currentPage === metaData.maxPage ? 'disabled' : ''}`}>
              <a className='page-link' href='#'>
                <i className='fas fa-chevron-right'></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Modal open={openUploadModal} size='lg' title='Upload Alternatif' setOpen={setOpenUploadModal}>
        <form ref={formRef} onSubmit={submitFile}>
          <input ref={inputFileRef} onChange={changeInputFile} type='file' className='d-none' accept='.xlsx' />
          <div className='d-flex align-items-center flex-column '>
            <button className='btn btn-warning' type='button' onClick={() => inputFileRef.current?.click()}>
              <i className='fas fa-upload' /> Pilih File Excel
            </button>

            {uploadedFileName && (
              <>
                <p className='h5 mt-5'>{uploadedFileName}</p>
                <button className='btn btn-primary mt-2' type='submit'>
                  <i className='fa fa-paper-plane' /> Submit
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Alternative
withDashboardLayout(Alternative)
