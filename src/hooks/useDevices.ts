import { useEffect, useState } from 'react'
import type { Device, Project } from 'api/api'
import { useApi } from 'hooks/useApi'

export const useDevices = (project?: Project): Device[] => {
	const [devices, setDevices] = useState<Device[]>([])
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		api.project(project).devices().then(setDevices).catch(console.error)
	}, [api, project])

	return devices
}
