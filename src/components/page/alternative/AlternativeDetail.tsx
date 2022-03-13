import { Pengajuan } from 'pages/dashboard/alternative'
import React from 'react'

interface Props {
  pengajuan: Pengajuan
}

const AlternativeDetail: React.FC<Props> = ({ pengajuan }) => {
  return (
    <div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Nama :</div>
        <div className='col-8 text-left p-3'>{pengajuan.nama}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Alamat :</div>
        <div className='col-8 text-left p-3'>{pengajuan.alamat}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Jenis Kelamin :</div>
        <div className='col-8 text-left p-3'>{pengajuan.jenisKelamin}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Kondisi Rumah :</div>
        <div className='col-8 text-left p-3'>{pengajuan.kondisiRumah}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Luas Tanah :</div>
        <div className='col-8 text-left p-3'>{pengajuan.luasTanah}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Pekerjaan :</div>
        <div className='col-8 text-left p-3'>{pengajuan.pekerjaan}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Penghasilan :</div>
        <div className='col-8 text-left p-3'>{pengajuan.penghasilan}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Umur :</div>
        <div className='col-8 text-left p-3'>{pengajuan.umur}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Status :</div>
        <div className='col-8 text-left p-3'>{pengajuan.status}</div>
      </div>
    </div>
  )
}

export default AlternativeDetail
