import type { GoliothDevice as ApiDevice } from 'api/api'
import React, { useState } from 'react'
import { Map } from 'theme/Map/Map'
import { ShowSettingsButton } from 'theme/Map/ShowSettingsButton'
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
