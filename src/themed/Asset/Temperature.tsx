import type { Device } from 'golioth/golioth'
import {
	SensorProperties,
	useAssetHistory,
} from 'golioth/hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'
import { ChartDateRange } from 'themed/ChartDateRange'
import { HistoricalDataChart } from 'themed/HistoricalDataChart'

export const Temperature = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const TemperatureHistory = useAssetHistory({
		asset,
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
