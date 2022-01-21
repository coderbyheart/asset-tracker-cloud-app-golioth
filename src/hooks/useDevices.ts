import type { Device } from 'api/golioth'
import { useApi } from 'hooks/useApi'
import { useCurrentProject } from 'hooks/useCurrentProject'
import { useEffect, useState } from 'react'

export const useDevices = (): Device[] => {
	const { project } = useCurrentProject()
	const [devices, setDevices] = useState<Device[]>([])
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		api.project(project).devices().then(setDevices).catch(console.error)
	}, [api, project])

	return devices
}
