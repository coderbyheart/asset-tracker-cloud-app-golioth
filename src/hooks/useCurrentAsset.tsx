import type { Device } from 'api/golioth'
import type { AssetTwin } from 'asset/state'
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useState,
} from 'react'

export const CurrentAssetContext = createContext<{
	info?: Device
	state?: AssetTwin
	setAsset: (_?: { info?: Device; state?: AssetTwin }) => void
}>({
	setAsset: () => undefined,
})

export const useCurrentAsset = () => useContext(CurrentAssetContext)

export const CurrentAssetProvider: FunctionComponent = ({ children }) => {
	const [asset, setAsset] = useState<{
		info?: Device
		state?: AssetTwin
	}>()

	return (
		<CurrentAssetContext.Provider
			value={{
				...asset,
				setAsset,
			}}
		>
			{children}
		</CurrentAssetContext.Provider>
	)
}
