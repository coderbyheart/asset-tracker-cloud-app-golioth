import type { GoliothProject } from 'api/api'
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useProjects } from './useProjects'

export const CurrentProjectContext = createContext<{
	project?: GoliothProject
	setProject: (_?: GoliothProject) => void
	projects: GoliothProject[]
}>({
	setProject: () => undefined,
	projects: [],
})

export const useCurrentProject = () => useContext(CurrentProjectContext)

export const CurrentProjectProvider: FunctionComponent = ({ children }) => {
	const projects = useProjects()
	const [project, setProject] = useState<GoliothProject>()

	useEffect(() => {
		if (projects.length > 0 && project === undefined) {
			setProject(projects[0])
		}
	}, [projects, project])

	return (
		<CurrentProjectContext.Provider
			value={{
				project,
				setProject,
				projects,
			}}
		>
			{children}
		</CurrentProjectContext.Provider>
	)
}
