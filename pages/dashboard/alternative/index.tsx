import React, { useEffect, useState } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import withDashboardLayout from 'src/components/layout/DashboardLayout'
import { useAppDispatch } from 'src/hook/useRedux'
import ReducerActions from 'src/redux/ReducerAction'
import useRequest from 'src/hook/useRequest'
import { API_ENDPOINT } from 'src/const/Global'
import { Pagination } from 'src/types/Global'
import Link from 'next/link'
import { Route } from 'src/const/Route'

export interface Pengajuan {
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
  const dispatch = useAppDispatch()
  const { authReq } = useRequest()
  const [alternativeList, setAlternativeList] = useState<Pengajuan[]>([])
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    maxPage: 1,
    dataPerPage: 1,
  })

  useEffect(() => {
    dispatch(ReducerActions.ui.setTitle('Alternatif'))
  }, [])

  useEffect(() => {
    fetchAlternative()
  }, [metaData.currentPage])

  const fetchAlternative = () => {
    dispatch(ReducerActions.ui.masterLoader(true))
    authReq<{ data: Pagination<Pengajuan[]> }>({
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

  const deleteConfirmation = (pengajuan: Pengajuan) => {
    dispatch(
      ReducerActions.ui.setConfirmationmodal({
        title: 'Are you sure?',
        message: `Apakah anda yakin ingin menghapus pengajuan ${pengajuan.nama} ?`,
        onConfirm: () => onDelete(pengajuan._id),
      })
    )
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
    </div>
  )
}

export default Alternative
withDashboardLayout(Alternative)
