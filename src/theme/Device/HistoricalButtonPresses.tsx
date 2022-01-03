import type { GoliothDevice } from 'api/api'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import React from 'react'
import { RelativeTime } from 'theme/RelativeTime'
import { ChartDateRange } from '../ChartDateRange'

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
							<td>{v}</td>
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
