import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { HistoricalDataChart } from 'components/HistoricalDataChart'
import { NoData } from 'components/NoData'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Temperature = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const TemperatureHistory = useAssetHistory({
		sensor: SensorProperties.Environment,
		startDate,
		endDate,
	})

	const data = TemperatureHistory.map(({ v, ts }) => ({
		date: new Date(ts),
		value: v.temp,
	}))

	return (
		<>
			<ChartDateRange />
			{data.length === 0 ? (
				<NoData />
			) : (
				<HistoricalDataChart data={data} type="line" />
			)}
		</>
	)
}
