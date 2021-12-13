import React, { createContext, useContext, FunctionComponent } from 'react'
import { api, Device, JWTKey, Project } from 'api/api'

const rejected = Promise.reject(new Error(`Not authenticated.`))

export const ApiContext = createContext<ReturnType<typeof api>>({
	projects: async () => Promise.resolve([]),
	project: (_: Pick<Project, 'id'>) => ({
		devices: async () => Promise.resolve([]),
		device: (_: Pick<Device, 'id'>) => ({
			get: async () => rejected,
			state: async () => rejected,
			history: async () => rejected,
		}),
	}),
})

export const useApi = () => useContext(ApiContext)

export const ApiProvider: FunctionComponent<{
	jwtKey: JWTKey
	endpoint: URL
}> = ({ children, jwtKey, endpoint }) => {
	return (
		<ApiContext.Provider value={api({ jwtKey, endpoint })}>
			{children}
		</ApiContext.Provider>
	)
}
