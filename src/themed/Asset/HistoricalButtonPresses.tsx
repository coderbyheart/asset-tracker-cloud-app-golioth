import type { Device } from 'golioth/golioth'
import {
	SensorProperties,
	useAssetHistory,
} from 'golioth/hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'
import { ChartDateRange } from 'themed/ChartDateRange'
import { RelativeTime } from 'themed/RelativeTime'

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
		asset,
		sensor: SensorProperties.Button,
		startDate,
		endDate,
	})

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
