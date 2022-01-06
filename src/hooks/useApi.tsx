import type { JWTKey } from 'api/golioth'
import { api } from 'api/golioth'
import React, { createContext, FunctionComponent, useContext } from 'react'

export const ApiContext = createContext<ReturnType<typeof api>>(
	undefined as unknown as ReturnType<typeof api>,
)

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
