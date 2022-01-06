import type { Device, Project } from 'golioth/golioth'
import { useApi } from 'golioth/hooks/useApi'
import { useEffect, useState } from 'react'

export const useAssets = (project?: Project): Device[] => {
	const [assets, setAssets] = useState<Device[]>([])
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		api.project(project).devices().then(setAssets).catch(console.error)
	}, [api, project])

	return assets
}
