import type { GoliothDevice } from 'api/api'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import React from 'react'
import { ChartDateRange } from '../ChartDateRange'
import { HistoricalDataChart } from '../HistoricalDataChart'

export const Battery = ({ device }: { device: GoliothDevice }) => {
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
