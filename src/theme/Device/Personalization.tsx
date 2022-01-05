import type { GoliothDevice } from 'api/api'
import { useCurrentDevice } from 'hooks/useCurrentDevice'
import { useUpdateDevice } from 'hooks/useUpdateDevice'
import React, { useState } from 'react'

export const Personalization = ({ device }: { device: GoliothDevice }) => {
	const [name, setName] = useState<string>(device.name ?? '')
	const update = useUpdateDevice({ device })
	const { state, setDevice } = useCurrentDevice()
	return (
		<form
			className="justify-content-center"
			data-intro="Use this form to give your device a recognizable name."
		>
			<label htmlFor="name">Customize the name of your device</label>
			<div className="d-flex flex-row">
				<input
					className="form-control"
					type="text"
					name="name"
					id="name"
					placeholder="e.g. 'My Thingy:91'"
					onChange={({ target: { value } }) => {
						setName(value)
					}}
					value={name}
				/>
				<button
					type="button"
					className="btn btn-primary ms-3"
					disabled={name === device.name}
					onClick={() => {
						setDevice({ info: { ...device, name }, state })
						update({ name }).catch(console.error)
					}}
				>
					Update
				</button>
			</div>
		</form>
	)
}
