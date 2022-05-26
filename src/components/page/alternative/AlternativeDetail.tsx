import React from 'react'
import { PengajuanDetail } from './AlternativeForm'

interface Props {
  pengajuan: PengajuanDetail
}

const AlternativeDetail: React.FC<Props> = ({ pengajuan }) => {
  return (
    <div>
      <h4 className='mt-4 text-left'>Informasi Personal</h4>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Nama :</div>
        <div className='col-8 text-left p-3'>{pengajuan.nama}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Alamat :</div>
        <div className='col-8 text-left p-3'>{pengajuan.alamat}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Banjar :</div>
        <div className='col-8 text-left p-3'>{pengajuan.namaBanjar}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Jenis Kelamin :</div>
        <div className='col-8 text-left p-3'>{pengajuan.jenisKelamin}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Pekerjaan :</div>
        <div className='col-8 text-left p-3'>{pengajuan.pekerjaan}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Umur :</div>
        <div className='col-8 text-left p-3'>{pengajuan.umur}</div>
      </div>
      <div className='row border-bottom'>
        <div className='col-4 text-left p-3 font-weight-bold'>Status :</div>
        <div className='col-8 text-left p-3'>{pengajuan.status}</div>
      </div>
      <h4 className='mt-4 text-left'>Informasi Kriteria</h4>
      <nav>
        <div className='nav nav-tabs' id='nav-tab' role='tablist'>
          {pengajuan?.criteria?.map((cr, key) => (
            <a
              key={key}
              className={`nav-link ${key === 0 ? 'active' : ''}`}
              id={`year-tab-${cr.year}`}
              data-toggle='tab'
              href={`#nav-tab${cr.year}`}
              role='tab'
              aria-controls='nav-home'
              aria-selected='true'>
              {cr.year}
            </a>
          ))}
        </div>
      </nav>
      <div className='tab-content' id='nav-tabContent'>
        {pengajuan?.criteria?.map((cr, key) => (
          <div
            key={key}
            className={`tab-pane fade ${key === 0 ? 'show active' : ''}`}
            id={`nav-tab${cr.year}`}
            role='tabpanel'
            aria-labelledby='nav-home-tab'>
            {cr.criteria?.map(criteria => (
              <div className='row border-bottom' key={criteria.id}>
                <div className='col-4 text-left p-3 font-weight-bold'>{criteria.name} :</div>
                <div className='col-8 text-left p-3'>{criteria.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlternativeDetail
