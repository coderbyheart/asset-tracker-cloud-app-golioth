import React, {
	createContext,
	useContext,
	useState,
	FunctionComponent,
} from 'react'
import { withLocalStorage } from '../../utils/withLocalStorage'
import { ENDPOINT, getToken, headers, JWTKey } from '../api'

export type Project = {
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
}

export type Device = {
	id: string
	hardwareIds: string[]
	name: string
	createdAt: Date
	updatedAt: Date
	tagIds: string[]
	data: any
	lastReport: Date
	status: string
}

type ProjectsInfo = {
	projects: Project[]
	currentProject?: Project
	setCurrentProject: (_: Project) => boolean
	fetchProjects: (jwtKey: JWTKey) => Promise<void>
	project: (project: Project) => {
		devices: (jwtKey: JWTKey) => Promise<Device[]>
	}
}

export const ProjectsContext = createContext<ProjectsInfo>({
	projects: [],
	setCurrentProject: () => false,
	fetchProjects: () => Promise.resolve(),
	project: (_: Project) => ({
		devices: (_: JWTKey) => Promise.resolve([]),
	}),
})

export const useProjects = () => useContext(ProjectsContext)

export class ApiError extends Error {
	public readonly httpStatusCode: number
	constructor(message: string, httpStatusCode: number) {
		super(message)
		this.name = 'ApiError'
		this.httpStatusCode = httpStatusCode
	}
}

export const ProjectsProvider: FunctionComponent = ({ children }) => {
	const storedProjects = withLocalStorage<Project[]>('auth:projects')
	const [projects, setProjects] = useState<Project[]>(
		(storedProjects.get() as Project[]) ?? [],
	)
	const storedCurrentProject = withLocalStorage<string>('auth:current-project')
	const [currentProject, setCurrentProject] = useState<string>(
		storedCurrentProject.get() as string,
	)

	const value: ProjectsInfo = {
		projects,
		currentProject: projects.find(({ id }) => id === currentProject),
		setCurrentProject: (project) => {
			const found = projects.find((p) => p.id === project.id)
			if (found) {
				setCurrentProject(found.id)
				storedCurrentProject.set(found.id)
				return true
			} else {
				return false
			}
		},
		fetchProjects: async ({ id, secret }) =>
			fetch(`${ENDPOINT}/projects`, {
				method: 'GET',
				headers: {
					...headers,
					Authorization: `Bearer ${await getToken({ id, secret })}`,
				},
			})
				.then((res) => {
					const { ok, status: httpStatusCode } = res
					if (!ok)
						throw new ApiError(`Failed to fetch projects!`, httpStatusCode)
					return res.json()
				})
				.then(({ list }) => {
					const projects = Object.values(list as Record<string, any>).map(
						(p) => ({
							...p,
							createdAt: new Date(p.createdAt),
							updatedAt: new Date(p.updatedAt),
						}),
					)
					console.log(
						'[projects]',
						projects.map(({ name }) => name),
					)
					setProjects(projects)
					storedProjects.set(projects)
				})
				.catch(console.error),
		project: (project: Project) => ({
			devices: async ({ id, secret }): Promise<Device[]> =>
				fetch(`${ENDPOINT}/projects/${project.id}/devices`, {
					method: 'GET',
					headers: {
						...headers,
						Authorization: `Bearer ${await getToken({ id, secret })}`,
					},
				})
					.then((res) => {
						const { ok, status: httpStatusCode } = res
						if (!ok)
							throw new ApiError(`Failed to fetch devices!`, httpStatusCode)
						return res.json()
					})
					.then(
						({ list }) =>
							Object.values(list as Record<string, any>).map((d) => ({
								...d,
								createdAt: new Date(d.createdAt),
								updatedAt: new Date(d.updatedAt),
								lastReport: new Date(d.lastReport),
							})) as Device[],
					)
					.catch((err) => {
						console.error(err)
						return []
					}),
		}),
	}

	return (
		<ProjectsContext.Provider value={value}>
			{children}
		</ProjectsContext.Provider>
	)
}
