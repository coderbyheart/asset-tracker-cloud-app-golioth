import { useEffect, useState } from 'react'
import type { Project } from 'api/api'
import { useApi } from 'hooks/useApi'

export const useProjects = (): Project[] => {
	const [projects, setProjects] = useState<Project[]>([])
	const api = useApi()

	useEffect(() => {
		api.projects().then(setProjects).catch(console.error)
	}, [api])

	return projects
}
