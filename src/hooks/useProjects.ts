import type { GoliothProject } from 'api/api'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export const useProjects = (): GoliothProject[] => {
	const [projects, setProjects] = useState<GoliothProject[]>([])
	const api = useApi()

	useEffect(() => {
		api.projects().then(setProjects).catch(console.error)
	}, [api])

	return projects
}
