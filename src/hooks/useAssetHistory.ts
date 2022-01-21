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
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'
import { useCurrentDevice } from './useCurrentDevice'

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
			sensor: SensorProperties.GNSS
		} & SharedArgs,
	): AssetHistory<GNSS>
	(
		_: {
			sensor: SensorProperties.Battery
		} & SharedArgs,
	): AssetHistory<Battery>
	(
		_: {
			sensor: SensorProperties.Environment
		} & SharedArgs,
	): AssetHistory<Environment>
	(
		_: {
			sensor: SensorProperties.Roaming
		} & SharedArgs,
	): AssetHistory<Roaming>
	(
		_: {
			sensor: SensorProperties.Asset
		} & SharedArgs,
	): AssetHistory<AssetInfo>
	(
		_: {
			sensor: SensorProperties.Button
		} & SharedArgs,
	): AssetHistory<Button>
}

export const useAssetHistory: useAssetHistoryType = <T extends AssetSensor>({
	sensor,
	limit,
	startDate,
	endDate,
}: {
	sensor: PropertyName
	limit?: number
	startDate?: Date
	endDate?: Date
}): AssetHistory<T> => {
	const [history, setHistory] = useState<AssetHistory<T>>([])
	const api = useApi()
	const { device } = useCurrentDevice()

	useEffect(() => {
		if (device === undefined) return
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.history<T>({ path: [sensor, 'v'], limit, startDate, endDate })
			.then(setHistory)
			.catch(console.error)
	}, [device, api, sensor, limit, startDate, endDate])

	return history
}
