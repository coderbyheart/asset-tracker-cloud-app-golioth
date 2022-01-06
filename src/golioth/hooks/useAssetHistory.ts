import type {
	AssetHistory,
	AssetInfo,
	AssetSensor,
	Battery,
	Button,
	Environment,
	GNSS,
	Roaming,
} from 'asset/state'
import type { Device } from 'golioth/golioth'
import { useApi } from 'golioth/hooks/useApi'
import { useEffect, useState } from 'react'

export enum SensorProperties {
	Battery = 'bat',
	Environment = 'env',
	GNSS = 'gnss',
	Roaming = 'roam',
	Asset = 'dev',
	Button = 'btn',
}

type PropertyName = SensorProperties | string

type SharedArgs = {
	limit?: number
	startDate?: Date
	endDate?: Date
}

type useAssetHistoryType = {
	(
		_: {
			asset: Device
			sensor: SensorProperties.GNSS
		} & SharedArgs,
	): AssetHistory<GNSS>
	(
		_: {
			asset: Device
			sensor: SensorProperties.Battery
		} & SharedArgs,
	): AssetHistory<Battery>
	(
		_: {
			asset: Device
			sensor: SensorProperties.Environment
		} & SharedArgs,
	): AssetHistory<Environment>
	(
		_: {
			asset: Device
			sensor: SensorProperties.Roaming
		} & SharedArgs,
	): AssetHistory<Roaming>
	(
		_: {
			asset: Device
			sensor: SensorProperties.Asset
		} & SharedArgs,
	): AssetHistory<AssetInfo>
	(
		_: {
			asset: Device
			sensor: SensorProperties.Button
		} & SharedArgs,
	): AssetHistory<Button>
}

export const useAssetHistory: useAssetHistoryType = <T extends AssetSensor>({
	asset,
	sensor,
	limit,
	startDate,
	endDate,
}: {
	asset: Device
	sensor: PropertyName
	limit?: number
	startDate?: Date
	endDate?: Date
}): AssetHistory<T> => {
	const [history, setHistory] = useState<AssetHistory<T>>([])
	const api = useApi()

	useEffect(() => {
		api
			.project({ id: asset.projectId })
			.device({ id: asset.id })
			.history<T>({ path: [sensor, 'v'], limit, startDate, endDate })
			.then(setHistory)
			.catch(console.error)
	}, [asset, api, sensor, limit, startDate, endDate])

	return history
}
