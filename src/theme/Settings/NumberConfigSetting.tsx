import { OutDatedWarning } from 'components/Settings/OutDatedWarning'
import React, { useState } from 'react'
import { emojify } from 'theme/Emojify'

export const NumberConfigSetting = ({
	label,
	intro,
	id,
	unit,
	example,
	step,
	onChange,
	desired,
	reported,
	minimum,
	maximum,
}: {
	label?: string
	intro?: string
	unit?: string
	example?: number
	step?: number
	id: 'actwt' | 'mvres' | 'mvt' | 'gpst' | 'acct'
	onChange: (v: string) => any
	desired?: number
	reported?: number
	minimum?: number
	maximum?: number
}) => {
	const [input, updateInput] = useState(`${desired ?? reported}`)
	const minValue = minimum ?? 0
	const maxValue = maximum ?? Number.MAX_SAFE_INTEGER
	return (
		<div className="input-group mb-2" data-intro={intro}>
			{label !== undefined && (
				<label className="form-label" htmlFor={id}>
					{label}:
				</label>
			)}
			<div className="input-group mb-2">
				<OutDatedWarning
					desired={desired}
					reported={reported}
					onNotReported={
						<span className="input-group-text text-danger">
							<abbr title={'Asset has not reported this setting, yet.'}>
								{emojify('❓')}
							</abbr>
						</span>
					}
					onOutDated={(current) => (
						<span className="input-group-text">
							<abbr
								title={`Asset has an outdated value. Current value: ${JSON.stringify(
									current,
								)}.`}
							>
								{emojify('⭕')}
							</abbr>
						</span>
					)}
				/>
				<input
					className="form-control"
					type="number"
					name={id}
					id={id}
					placeholder={`e.g. "${example ?? 60}"`}
					step={step}
					min={minValue}
					max={maxValue}
					value={input}
					onChange={({ target: { value } }) => {
						if (parseInt(value) < minValue) value = `${minValue}`
						if (parseInt(value) > maxValue) value = `${maxValue}`
						updateInput(value)
						onChange(value)
					}}
				/>
				<span className="input-group-text">{unit ?? 's'}</span>
			</div>
		</div>
	)
}
