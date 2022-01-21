import type { Project } from 'api/golioth'
import { useApi } from 'hooks/useApi'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'

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
