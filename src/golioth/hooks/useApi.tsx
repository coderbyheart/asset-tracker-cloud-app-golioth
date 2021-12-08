import React, { createContext, useContext, FunctionComponent } from 'react'
import { api, JWTKey, Project } from '../api'

export const ApiContext = createContext<ReturnType<typeof api>>({
	projects: async () => Promise.resolve([]),
	project: (_: Project) => ({
		devices: async () => Promise.resolve([]),
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
