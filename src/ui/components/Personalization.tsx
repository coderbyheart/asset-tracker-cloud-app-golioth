import type { Device } from 'api/api'
import { useDeviceUpdate } from 'hooks/useDeviceUpdate'
import { useGlobalDevice } from 'hooks/useGlobalDevice'
import React, { useState } from 'react'

export const Personalization = ({ device }: { device: Device }) => {
	const [name, setName] = useState<string>(device.name ?? '')
	const update = useDeviceUpdate({ device })
	const { state, setDevice } = useGlobalDevice()
	return (
		<form className="row justify-content-center">
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
