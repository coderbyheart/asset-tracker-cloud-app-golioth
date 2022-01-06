import type { Device } from 'api/golioth'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'
import { ChartDateRange } from '../ChartDateRange'
import { HistoricalDataChart } from '../HistoricalDataChart'

export const Battery = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const batteryHistory = useAssetHistory({
		asset,
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
