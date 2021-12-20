import React, { useState } from 'react'
import { Map } from 'ui/components/Map/Map'
import type { Device as ApiDevice } from 'api/api'
import { ShowSettingsButton } from 'ui/components/Map/ShowSettingsButton'
import { MapSettings } from './Settings'

export const MapWithSettings = ({ device }: { device: ApiDevice }) => {
	const [showSettings, toggleSettings] = useState<boolean>(false)
	return (
		<>
			<div style={{ position: 'relative' }}>
				<Map device={device} />
				<ShowSettingsButton
					onToggle={(collapsed) => toggleSettings(!collapsed)}
				/>
			</div>
			{showSettings && <MapSettings />}
		</>
	)
}
