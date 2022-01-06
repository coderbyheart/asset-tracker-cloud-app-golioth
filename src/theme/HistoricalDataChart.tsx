import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import { nanoid } from 'nanoid'
import React, { useLayoutEffect, useRef } from 'react'

export const HistoricalDataChart = ({
	data,
	type,
	min,
	max,
}: {
	data: { date: Date; value: number }[]
	type: 'line' | 'column'
	min?: number
	max?: number
}) => {
	const uuid = useRef<string>(nanoid())

	useLayoutEffect(() => {
		const root = am5.Root.new(uuid.current)
		const chart = root.container.children.push(am5xy.XYChart.new(root, {}))

		const dateAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
				baseInterval: { timeUnit: 'second', count: 1 },
				renderer: am5xy.AxisRendererX.new(root, {}),
			}),
		)

		const valueAxes = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				min,
				max,
				renderer: am5xy.AxisRendererY.new(root, {}),
			}),
		)

		const tooltip = am5.Tooltip.new(root, {
			labelText: '{valueY}',
		})

		const series = chart.series.push(
			type === 'column'
				? am5xy.ColumnSeries.new(root, {
						xAxis: dateAxis,
						yAxis: valueAxes,
						valueYField: 'value',
						valueXField: 'date',
						tooltip,
				  })
				: am5xy.LineSeries.new(root, {
						xAxis: dateAxis,
						yAxis: valueAxes,
						valueYField: 'value',
						valueXField: 'date',
						tooltip,
				  }),
		)

		series.data.setAll(
			data.map(({ date, value }) => ({ value, date: date.getTime() })),
		)

		chart.set(
			'cursor',
			am5xy.XYCursor.new(root, {
				snapToSeries: [series],
				xAxis: dateAxis,
			}),
		)

		return () => {
			root.dispose()
		}
	}, [data, type, min, max, uuid])

	return <div style={{ width: '100%', height: '300px' }} id={uuid.current} />
}
