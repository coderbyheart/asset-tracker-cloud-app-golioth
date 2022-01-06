import type { Device as ApiAsset } from 'golioth/golioth'
import { MapSettingsProvider } from 'hooks/useMapSettings'
import React, { useState } from 'react'
import { Map } from 'themed/Map/Map'
import { MapSettings } from 'themed/Map/Settings'
import { ShowSettingsButton } from 'themed/Map/ShowSettingsButton'

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
