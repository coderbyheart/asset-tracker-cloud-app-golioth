import React from 'react'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const ChartDateRange = () => {
	const {
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		defaultStart,
		defaultEnd,
	} = useChartDateRange()
	return (
		<form className="row">
			<fieldset className="col-12 d-flex d-flex-row justify-content-between">
				<div className="row">
					<div className="col-auto">
						<label htmlFor="inclusiveStartDate" className="col-form-label">
							Start date
						</label>
					</div>
					<div className="col-auto">
						<input
							type="date"
							id="inclusiveStartDate"
							className="form-control"
							value={startDate.toISOString().substring(0, 10)}
							onChange={({ target: { value } }) => {
								try {
									setStartDate(value === '' ? defaultStart : new Date(value))
								} catch {
									// pass
								}
							}}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-auto">
						<label htmlFor="inclusiveEndDate" className="col-form-label">
							End date
						</label>
					</div>
					<div className="col-auto">
						<input
							type="date"
							id="inclusiveEndDate"
							className="form-control"
							value={endDate.toISOString().substring(0, 10)}
							onChange={({ target: { value } }) => {
								try {
									setEndDate(value === '' ? defaultEnd : new Date(value))
								} catch {
									// pass
								}
							}}
						/>
					</div>
				</div>
			</fieldset>
		</form>
	)
}
