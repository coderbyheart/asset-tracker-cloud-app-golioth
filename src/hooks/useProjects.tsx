import type { Project } from 'api/golioth'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useApi } from './useApi'

export const ProjectsContext = createContext<Project[]>([])

export const useProjects = () => useContext(ProjectsContext)

export const ProjectsProvider: FunctionComponent = ({ children }) => {
	const [projects, setProjects] = useState<Project[]>([])
	const api = useApi()

	useEffect(() => {
		api
			.projects()
			.then(setProjects)
			.catch((err) => {
				console.error('[ProjectsProvider]', err)
			})
	}, [api])

	return (
		<ProjectsContext.Provider value={projects}>
			{children}
		</ProjectsContext.Provider>
	)
}
