import type { Device, Project } from 'api/golioth'
import { useApi } from 'hooks/useApi'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'

export const ProjectContext = createContext<{
	project?: Project
	setProject: (_?: Project) => void
	projects: Project[]
	devices: Device[]
}>({
	setProject: () => undefined,
	projects: [],
	devices: [],
})

export const useProject = () => useContext(ProjectContext)

export const ProjectProvider: FunctionComponent = ({ children }) => {
	const [project, setProject] = useState<Project>()
	const [projects, setProjects] = useState<Project[]>([])
	const [devices, setDevices] = useState<Device[]>([])
	const api = useApi()

	// Fetch all projects
	useEffect(() => {
		api
			.projects()
			.then(setProjects)
			.catch((err) => {
				console.error('[ProjectsProvider]', err)
			})
	}, [api])

	// Set first project as selected
	useEffect(() => {
		if (projects.length > 0 && project === undefined) {
			setProject(projects[0])
		}
	}, [projects, project])

	// Load devices for project
	useEffect(() => {
		if (project === undefined) return
		api.project(project).devices().then(setDevices).catch(console.error)
	}, [api, project])

	return (
		<ProjectContext.Provider
			value={{
				project,
				setProject,
				projects,
				devices,
			}}
		>
			{children}
		</ProjectContext.Provider>
	)
}
