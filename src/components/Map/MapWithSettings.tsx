import type { Device as ApiAsset } from 'api/golioth'
import { Map } from 'components/Map/Map'
import { MapSettings } from 'components/Map/Settings'
import { ShowSettingsButton } from 'components/Map/ShowSettingsButton'
import { MapSettingsProvider } from 'hooks/useMapSettings'
import { useState } from 'react'

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
