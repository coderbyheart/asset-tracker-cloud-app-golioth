import type { Project } from 'golioth/golioth'
import { useProjects } from 'golioth/hooks/useProjects'
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'

export const CurrentProjectContext = createContext<{
	project?: Project
	setProject: (_?: Project) => void
	projects: Project[]
}>({
	setProject: () => undefined,
	projects: [],
})

export const useCurrentProject = () => useContext(CurrentProjectContext)

export const CurrentProjectProvider: FunctionComponent = ({ children }) => {
	const projects = useProjects()
	const [project, setProject] = useState<Project>()

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
