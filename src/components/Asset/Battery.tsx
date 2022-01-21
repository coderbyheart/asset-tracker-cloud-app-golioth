import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { HistoricalDataChart } from 'components/HistoricalDataChart'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Battery = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const batteryHistory = useAssetHistory({
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
