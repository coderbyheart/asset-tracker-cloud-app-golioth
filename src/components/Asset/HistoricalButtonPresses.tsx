import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { NoData } from 'components/NoData'
import { RelativeTime } from 'components/RelativeTime'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

const toButtonEmoji = (value: number): JSX.Element => {
	switch (value) {
		case 1:
			return <span>1️⃣</span>
		case 2:
			return <span>2️⃣</span>
		case 3:
			return <span>3️⃣</span>
		case 4:
			return <span>4️⃣</span>
		default:
			return <span>{value}</span>
	}
}

export const HistoricalButtonPresses = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const buttonHistory = useAssetHistory({
		sensor: SensorProperties.Button,
		startDate,
		endDate,
	})

	if (buttonHistory.length === 0)
		return (
			<>
				<ChartDateRange />
				<NoData />
			</>
		)

	return (
		<>
			<ChartDateRange />
			<table className="table">
				<thead>
					<tr>
						<th>Button</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					{buttonHistory.map(({ v, ts }, k) => (
						<tr key={k}>
							<td>{toButtonEmoji(v)}</td>
							<td>
								{ts.toLocaleString()}{' '}
								<small>
									(<RelativeTime ts={ts} />)
								</small>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
