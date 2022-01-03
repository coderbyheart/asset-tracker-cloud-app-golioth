import type { GoliothDevice } from 'api/api'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import React from 'react'
import { ChartDateRange } from '../ChartDateRange'
import { HistoricalDataChart } from '../HistoricalDataChart'

export const RSRP = ({ device }: { device: GoliothDevice }) => {
	const { startDate, endDate } = useChartDateRange()
	const RSRPHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Roaming,
		startDate,
		endDate,
	})

	return (
		<>
			<ChartDateRange />
			<HistoricalDataChart
				data={RSRPHistory.map(({ v, ts }) => ({
					date: new Date(ts),
					value: v.rsrp,
				}))}
				type="line"
			/>
		</>
	)
}
