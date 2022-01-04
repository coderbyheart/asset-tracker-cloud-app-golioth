import type { GoliothDevice } from 'api/api'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import React from 'react'
import { emojify } from 'theme/Emojify'
import { RelativeTime } from 'theme/RelativeTime'
import { ChartDateRange } from '../ChartDateRange'

const toButtonEmoji = (value: number): JSX.Element => {
	switch (value) {
		case 1:
			return emojify('1️⃣')
		case 2:
			return emojify('2️⃣')
		case 3:
			return emojify('3️⃣')
		case 4:
			return emojify('4️⃣')
		default:
			return <span>{value}</span>
	}
}

export const HistoricalButtonPresses = ({
	device,
}: {
	device: GoliothDevice
}) => {
	const { startDate, endDate } = useChartDateRange()
	const buttonHistory = useDeviceHistory({
		device,
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
