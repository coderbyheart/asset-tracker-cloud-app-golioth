import React, {
	createContext,
	useContext,
	useState,
	FunctionComponent,
} from 'react'
import { withLocalStorage } from '../../utils/withLocalStorage'
import type { JWTKey } from '../api'
import { ApiError, useProjects } from './useProjects'

type AuthInfo = {
	jwtKey?: JWTKey
	isAuthenticated: boolean
	logout: () => Promise<void>
	login: (_: JWTKey) => Promise<void>
}

export const AuthContext = createContext<AuthInfo>({
	isAuthenticated: false,
	logout: () => Promise.resolve(),
	login: () => Promise.resolve(),
})

export const useAuth = () => useContext(AuthContext)

export class AuthError extends Error {
	public readonly httpStatusCode: number
	constructor(message: string, httpStatusCode: number) {
		super(message)
		this.name = 'AuthError'
		this.httpStatusCode = httpStatusCode
	}
}

export const AuthProvider: FunctionComponent = ({ children }) => {
	const { fetchProjects } = useProjects()
	const storedIsAuthenticated = withLocalStorage<boolean>(
		'auth:isAuthenticated',
		false,
	)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		storedIsAuthenticated.get() as boolean,
	)
	const storedJwtKey = withLocalStorage<JWTKey>('auth:jwt')
	const [jwtKey, setJwtKey] = useState<JWTKey>(storedJwtKey.get() as JWTKey)

	const auth: AuthInfo = {
		jwtKey,
		isAuthenticated,
		logout: async () => {
			setIsAuthenticated(false)
			storedIsAuthenticated.destroy()
			storedJwtKey.destroy()
			const current = new URL(document.location.href)
			document.location.href = new URL(
				import.meta.env.SNOWPACK_PUBLIC_BASE_URL ?? '/',
				`${current.protocol}//${current.host}${current.pathname}`,
			).toString()
		},
		login: async ({ id, secret }) =>
			fetchProjects({ id, secret })
				.then(() => {
					setIsAuthenticated(true)
					storedIsAuthenticated.set(true)
					setJwtKey({ id, secret })
				})
				.catch((err) => {
					console.error(err)
					setIsAuthenticated(false)
					storedIsAuthenticated.set(false)
					throw new AuthError(
						`Failed to log-in!`,
						(err as ApiError).httpStatusCode,
					)
				}),
	}

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
