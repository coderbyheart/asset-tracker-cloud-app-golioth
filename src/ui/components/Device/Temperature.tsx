import React from 'react'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import type { Device } from 'api/api'
import { HistoricalDataChart } from '../HistoricalDataChart'
import { ChartDateRange } from '../ChartDateRange'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Temperature = ({ device }: { device: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const TemperatureHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Environment,
		startDate,
		endDate,
	})

	return (
		<>
			<ChartDateRange />
			<HistoricalDataChart
				data={TemperatureHistory.map(({ v, ts }) => ({
					date: new Date(ts),
					value: v.temp,
				}))}
				type="line"
			/>
		</>
	)
}
