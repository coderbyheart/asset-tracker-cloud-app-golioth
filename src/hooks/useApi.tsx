import type { GoliothDevice, GoliothProject, JWTKey } from 'api/api'
import { api } from 'api/api'
import React, { createContext, FunctionComponent, useContext } from 'react'

const rejected = Promise.reject(new Error(`Not authenticated.`))

export const ApiContext = createContext<ReturnType<typeof api>>({
	projects: async () => Promise.resolve([]),
	project: (_: Pick<GoliothProject, 'id'>) => ({
		devices: async () => Promise.resolve([]),
		device: (_: Pick<GoliothDevice, 'id'>) => ({
			get: async () => rejected,
			state: {
				get: async () => rejected,
				update: async () => rejected,
			},
			history: async () => rejected,
			multiHistory: async () => rejected,
			update: async () => rejected,
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
