import type { Device } from 'api/golioth'
import { useCurrentDevice } from 'hooks/useCurrentDevice'
import { useState } from 'react'

export const Personalization = ({ asset }: { asset: Device }) => {
	const [name, setName] = useState<string>(asset.name ?? '')
	const { updateDeviceSettings } = useCurrentDevice()
	return (
		<form
			className="justify-content-center"
			data-intro="Use this form to give your asset a recognizable name."
		>
			<label htmlFor="name">Customize the name of your asset</label>
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
					disabled={name === asset.name}
					onClick={() => {
						updateDeviceSettings({ name }).catch(console.error)
					}}
				>
					Update
				</button>
			</div>
		</form>
	)
}
