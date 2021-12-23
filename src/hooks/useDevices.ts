import type { GoliothDevice, GoliothProject } from 'api/api'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export const useDevices = (project?: GoliothProject): GoliothDevice[] => {
	const [devices, setDevices] = useState<GoliothDevice[]>([])
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		api.project(project).devices().then(setDevices).catch(console.error)
	}, [api, project])

	return devices
}
