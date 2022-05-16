import { useEffect, useRef } from 'react'
import {
  BubbleDataPoint,
  Chart,
  ChartConfiguration,
  ChartItem,
  ChartTypeRegistry,
  registerables,
  ScatterDataPoint,
} from 'chart.js'

const useChart = (
  canvasId: string,
  config: ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], unknown>
) => {
  const currentChart =
    useRef<Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], unknown>>()

  useEffect(() => {
    Chart.register(...registerables)

    const el = document.getElementById(canvasId) as ChartItem

    currentChart.current = new Chart(el, config)

    return () => currentChart.current?.destroy()
  }, [])

  const updateChart = (
    config: ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], unknown>
  ) => {
    currentChart.current?.destroy()
    Chart.register(...registerables)
    const el = document.getElementById(canvasId) as ChartItem
    currentChart.current = undefined
    currentChart.current = new Chart(el, config)
  }

  return { chart: currentChart.current, updateChart }
}

export default useChart
