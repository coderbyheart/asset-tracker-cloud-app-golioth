import * as jose from 'jose'

export const headers = {
	'content-type': 'application/json; charset=utf-8',
}

export type JWTKey = { id: string; secret: string }

export const getToken = async ({ id, secret }: JWTKey): Promise<string> =>
	new jose.SignJWT({})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer(id)
		.setExpirationTime('5m')
		.sign(new TextEncoder().encode(secret))

export class ApiError extends Error {
	public readonly httpStatusCode: number
	constructor(message: string, httpStatusCode: number) {
		super(message)
		this.name = 'ApiError'
		this.httpStatusCode = httpStatusCode
	}
}

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

export const api = ({
	jwtKey: { id, secret },
	endpoint,
}: {
	jwtKey: JWTKey
	endpoint: URL
}): {
	projects: () => Promise<Project[]>
	project: (_: Project) => {
		devices: () => Promise<Device[]>
	}
} => {
	const base = endpoint.toString().replace(/\/$/g, '')
	return {
		projects: async () => {
			const res = await fetch(`${base}/projects`, {
				method: 'GET',
				headers: {
					...headers,
					Authorization: `Bearer ${await getToken({ id, secret })}`,
				},
			})
			const { ok, status: httpStatusCode } = res
			if (!ok) throw new ApiError(`Failed to fetch projects!`, httpStatusCode)
			const { list } = await res.json()
			const projects = Object.values(list as Record<string, any>).map((p) => ({
				...p,
				createdAt: new Date(p.createdAt),
				updatedAt: new Date(p.updatedAt),
			}))
			console.log(
				'[projects]',
				projects.map(({ name }) => name),
			)
			return projects
		},
		project: (project: Project) => ({
			devices: async (): Promise<Device[]> => {
				const res = await fetch(`${base}/projects/${project.id}/devices`, {
					method: 'GET',
					headers: {
						...headers,
						Authorization: `Bearer ${await getToken({ id, secret })}`,
					},
				})
				const { ok, status: httpStatusCode } = res
				if (!ok) throw new ApiError(`Failed to fetch devices!`, httpStatusCode)
				const { list } = await res.json()
				return Object.values(list as Record<string, any>).map((d) => ({
					...d,
					createdAt: new Date(d.createdAt),
					updatedAt: new Date(d.updatedAt),
					lastReport: new Date(d.lastReport),
				})) as Device[]
			},
		}),
	}
}
