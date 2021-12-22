import React from 'react'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import type { Device } from 'api/api'
import { HistoricalDataChart } from '../HistoricalDataChart'
import { ChartDateRange } from '../ChartDateRange'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Battery = ({ device }: { device: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const batteryHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Battery,
		startDate,
		endDate,
	})

	return (
		<>
			<ChartDateRange />
			<HistoricalDataChart
				data={batteryHistory.map(({ v, ts }) => ({
					date: new Date(ts),
					value: v / 1000,
				}))}
				type="line"
			/>
		</>
	)
}
