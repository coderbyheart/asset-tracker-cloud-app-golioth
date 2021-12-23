import type { GoliothDevice } from 'api/api'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import React from 'react'
import { ChartDateRange } from '../ChartDateRange'
import { HistoricalDataChart } from '../HistoricalDataChart'

export const Temperature = ({ device }: { device: GoliothDevice }) => {
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
