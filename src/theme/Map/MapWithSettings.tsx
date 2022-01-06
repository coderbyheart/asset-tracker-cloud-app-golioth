import type { Device as ApiAsset } from 'api/golioth'
import { MapSettingsProvider } from 'hooks/useMapSettings'
import React, { useState } from 'react'
import { Map } from 'theme/Map/Map'
import { ShowSettingsButton } from 'theme/Map/ShowSettingsButton'
import { MapSettings } from './Settings'

export const MapWithSettings = ({ asset }: { asset: ApiAsset }) => {
	const [showSettings, toggleSettings] = useState<boolean>(false)
	return (
		<MapSettingsProvider>
			<div style={{ position: 'relative' }}>
				<Map asset={asset} />
				<ShowSettingsButton
					onToggle={(collapsed) => toggleSettings(!collapsed)}
				/>
			</div>
			{showSettings && <MapSettings />}
		</MapSettingsProvider>
	)
}
