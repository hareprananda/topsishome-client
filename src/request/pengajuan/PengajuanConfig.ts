import { AxiosRequestConfig } from 'axios'
import { API_ENDPOINT } from 'src/const/Global'

const PengajuanConfig = () => {
  const pengajuanChart = (): AxiosRequestConfig<{ bleh: string }> => ({
    url: `${API_ENDPOINT}/api/result-profile-chart`,
  })

  return { pengajuanChart }
}

export default PengajuanConfig()
