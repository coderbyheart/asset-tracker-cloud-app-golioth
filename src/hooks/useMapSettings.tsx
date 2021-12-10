import React, {
	createContext,
	useContext,
	FunctionComponent,
	useState,
	useReducer,
} from 'react'
import { withLocalStorage } from '../utils/withLocalStorage'

type Settings = {
	enabledLayers: {
		headings: boolean
		singlecellLocations: boolean
		multicellLocations: boolean
		history: boolean
	}
	numHistoryEntries: number
	follow: boolean
	zoom: number
}

const userZoomSetting = withLocalStorage<number>('map:zoom', 13)

const defaults: Settings = {
	numHistoryEntries: 10,
	follow: true,
	enabledLayers: {
		headings: true,
		singlecellLocations: true,
		multicellLocations: true,
		history: true,
	},
	zoom: userZoomSetting.get(),
}

export const MapSettingsContext = createContext<{
	settings: Settings
	update: (_: Partial<Settings>) => void
}>({
	settings: defaults,
	update: () => undefined,
})

export const useMapSettings = () => useContext(MapSettingsContext)

export const MapSettingsProvider: FunctionComponent = ({ children }) => {
	const [settings, update] = useState<Settings>(defaults)
	return (
		<MapSettingsContext.Provider
			value={{
				settings,
				update: (newSettings: Partial<Settings>) =>
					update((settings) => {
						const updated = { ...settings, ...newSettings }
						userZoomSetting.set(updated.zoom)
						return updated
					}),
			}}
		>
			{children}
		</MapSettingsContext.Provider>
	)
}
