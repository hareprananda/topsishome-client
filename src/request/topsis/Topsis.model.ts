export interface Result {
  id: string
  nama: string
  alamat: string
  banjar: string
  value: number
}

export interface ResultDetail {
  rawData: {
    _id: string
    nama: string
    criteria: {
      _id: string
      name: string
      keterangan: 'cost' | 'benefit'
      bobot: number
      value: number
    }[]
  }[]
  normalisasi: {
    _id: string
    nama: string
    criteria: {
      _id: string
      name: string
      keterangan: 'cost' | 'benefit'
      bobot: number
      value: number
    }[]
  }[]
  normalisasiTerbobot: {
    _id: string
    nama: string
    criteria: {
      _id: string
      name: string
      keterangan: 'cost' | 'benefit'
      bobot: number
      value: number
    }[]
  }[]
  idealSolution: {
    positif: Record<string, number>
    negatif: Record<string, number>
  }
  idealSolutionDistance: {
    dPlus: number
    dMin: number
    nama: string
    id: string
  }[]
  finalRanking: Result[]
}
