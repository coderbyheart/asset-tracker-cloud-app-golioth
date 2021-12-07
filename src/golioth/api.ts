import * as jose from 'jose'

export const ENDPOINT = (
	import.meta.env.SNOWPACK_PUBLIC_API_ENDPOINT ?? 'https://api.golioth.io/v1/'
)?.replace(/\/$/, '')

export const headers = {
	'content-type': 'application/json; charset=utf-8',
}

export type JWTKey = { id: string; secret: string }

export const getToken = async ({ id, secret }: JWTKey) =>
	new jose.SignJWT({})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer(id)
		.setExpirationTime('5m')
		.sign(new TextEncoder().encode(secret))
