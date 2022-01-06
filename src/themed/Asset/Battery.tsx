import type { Device } from 'golioth/golioth'
import {
	SensorProperties,
	useAssetHistory,
} from 'golioth/hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'
import { ChartDateRange } from 'themed/ChartDateRange'
import { HistoricalDataChart } from 'themed/HistoricalDataChart'

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
