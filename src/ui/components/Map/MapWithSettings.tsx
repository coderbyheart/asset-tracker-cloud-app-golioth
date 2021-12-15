import React, { useState } from 'react'
import { Map } from 'ui/components/Map/Map'
import type { Device as ApiDevice } from 'api/api'
import { ShowSettingsButton } from 'ui/components/Map/ShowSettingsButton'
import styled from 'styled-components'
import { MapSettingsProvider } from 'hooks/useMapSettings'
import { MapSettings } from './Settings'

const MapWithSettingsContainer = styled.div`
	position: relative;
`

export const MapWithSettings = ({ device }: { device: ApiDevice }) => {
	const [showSettings, toggleSettings] = useState<boolean>(false)
	return (
		<>
			<MapWithSettingsContainer>
				<Map device={device} />
				<ShowSettingsButton
					onToggle={(collapsed) => toggleSettings(!collapsed)}
				/>
			</MapWithSettingsContainer>
			{showSettings && <MapSettings />}
		</>
	)
}
