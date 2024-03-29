import type { JWTKey } from 'api/golioth'
import { api, ApiError } from 'api/golioth'
import { createContext, FunctionComponent, useContext, useState } from 'react'
import { withLocalStorage } from 'utils/withLocalStorage'

type AuthInfo = {
	jwtKey?: JWTKey
	isAuthenticated: boolean
	logout: () => Promise<void>
	login: (_: JWTKey) => Promise<void>
}

const storedIsAuthenticated = withLocalStorage<boolean>({
	key: 'auth:isAuthenticated',
	defaultValue: false,
})
const storedJwtKey = withLocalStorage<JWTKey>({
	key: 'auth:jwt',
})

export const defaults = {
	isAuthenticated: storedIsAuthenticated.get() ?? false,
	jwtKey: storedJwtKey.get(),
	logout: async () => Promise.resolve(),
	login: async () => Promise.resolve(),
}

export const AuthContext = createContext<AuthInfo>(defaults)

export const useAuth = () => useContext(AuthContext)

export class AuthError extends Error {
	public readonly httpStatusCode: number
	constructor(message: string, httpStatusCode: number) {
		super(message)
		this.name = 'AuthError'
		this.httpStatusCode = httpStatusCode
	}
}

export const AuthProvider: FunctionComponent<{ apiEndpoint: URL }> = ({
	children,
	apiEndpoint,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		storedIsAuthenticated.get(),
	)
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
				import.meta.env.BASE_URL ?? '/',
				`${current.protocol}//${current.host}${current.pathname}`,
			).toString()
		},
		login: async ({ id, secret }) =>
			api({ endpoint: apiEndpoint, jwtKey: { id, secret } })
				.projects()
				.then(() => {
					setIsAuthenticated(true)
					storedIsAuthenticated.set(true)
					storedJwtKey.set({ id, secret })
					setJwtKey({ id, secret })
				})
				.catch((err) => {
					console.error(err)
					setIsAuthenticated(false)
					storedIsAuthenticated.set(false)
					storedJwtKey.destroy()
					throw new AuthError(
						`Failed to log-in!`,
						(err as ApiError).httpStatusCode,
					)
				}),
	}

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
