import type {
	AssetHistory,
	AssetHistoryDatum,
	AssetSensor,
	AssetState,
} from 'asset/state'
import { DataModules } from 'asset/state'
import { sub } from 'date-fns'
import { filterNull } from 'golioth/utils/filterNull'
import { objectFlagsToArray } from 'golioth/utils/objectFlagsToArray'
import * as jose from 'jose'
import rfdc from 'rfdc'

const clone = rfdc()

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
	projectId: string
	hardwareIds: string[]
	name: string
	createdAt: Date
	updatedAt: Date
	tagIds: string[]
	data: any
	lastReport: Date
	status: string
}

type QueryParameters = {
	limit?: number
	page?: number
	startDate?: Date
	endDate?: Date
}

const toAsset = (project: Pick<Project, 'id'>) => (d: any) =>
	({
		...d,
		createdAt: new Date(d.createdAt),
		updatedAt: new Date(d.updatedAt),
		lastReport: new Date(d.lastReport),
		projectId: project.id,
	} as Device)

export const api = ({
	jwtKey: { id, secret },
	endpoint,
}: {
	jwtKey: JWTKey
	endpoint: URL
}): {
	projects: () => Promise<Project[]>
	project: (project: Pick<Project, 'id'>) => {
		devices: () => Promise<Device[]>
		device: (device: Pick<Device, 'id'>) => {
			get: () => Promise<Device>
			state: {
				get: () => Promise<Record<string, any>>
				update: (state: AssetState) => Promise<void>
			}
			history: <T extends AssetSensor>(
				query: {
					path: string[]
				} & QueryParameters,
			) => Promise<AssetHistory<T>>
			multiHistory: <T extends Record<string, AssetSensor>>(
				query: {
					sensors: string[]
				} & QueryParameters,
			) => Promise<{ [K in keyof T]: AssetHistoryDatum<T[K]> }>
			update: (properties: { name: string }) => Promise<Device>
		}
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
			return projects
		},
		project: (project: Pick<Project, 'id'>) => ({
			devices: async () => {
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
				return Object.values(list as Record<string, any>).map(toAsset(project))
			},
			device: (device: Pick<Device, 'id'>) => ({
				get: async () => {
					const res = await fetch(
						`${base}/projects/${project.id}/devices/${device.id}`,
						{
							method: 'GET',
							headers: {
								...headers,
								Authorization: `Bearer ${await getToken({ id, secret })}`,
							},
						},
					)
					const { ok, status: httpStatusCode } = res
					if (!ok) throw new ApiError(`Failed to fetch device!`, httpStatusCode)
					return toAsset(project)((await res.json()).data)
				},
				state: {
					get: async () => {
						const res = await fetch(
							`${base}/projects/${project.id}/devices/${device.id}/data`,
							{
								method: 'GET',
								headers: {
									...headers,
									Authorization: `Bearer ${await getToken({ id, secret })}`,
								},
							},
						)
						const { ok, status: httpStatusCode } = res
						if (!ok)
							throw new ApiError(`Failed to fetch device!`, httpStatusCode)

						const state = (await res.json()).data
						const result = {
							desired: {
								...state.desired,
								cfg: {
									...state.desired?.cfg,
									nod: objectFlagsToArray(state.desired?.cfg?.nod),
								},
							},
							reported: {
								...state.reported,
								cfg: {
									...state.reported?.cfg,
									nod: objectFlagsToArray(state.reported?.cfg?.nod),
								},
							},
						}
						return result
					},
					update: async (patch) => {
						const update = clone(patch) as any
						if (update.cfg?.nod !== undefined) {
							update.cfg.nod = Object.values(DataModules).reduce(
								(nod, module) => ({
									...nod,
									[module]: patch.cfg?.nod?.includes(module) ?? false,
								}),
								{} as Record<string, boolean>,
							)
						}
						await fetch(
							`${base}/projects/${project.id}/devices/${device.id}/data/desired`,
							{
								method: 'PATCH',
								headers: {
									...headers,
									Authorization: `Bearer ${await getToken({ id, secret })}`,
								},
								body: JSON.stringify(update),
							},
						)
					},
				},
				history: async <T extends AssetSensor>({
					path,
					limit,
					page,
					startDate,
					endDate,
				}: {
					path: string[]
					limit?: number
					page?: number
					startDate?: Date
					endDate?: Date
				}) => {
					const res = await fetch(
						`${base}/projects/${project.id}/devices/${device.id}/stream`,
						{
							method: 'POST',
							headers: {
								...headers,
								Authorization: `Bearer ${await getToken({ id, secret })}`,
							},
							body: JSON.stringify({
								start: (
									startDate ?? sub(new Date(), { months: 1 })
								).toISOString(),
								end: (endDate ?? new Date()).toISOString(),
								query: {
									fields: [
										{
											path: path.join('.'),
											alias: 'v',
										},
										{ path: 'time' },
									],
									filters: [
										// Should be in requested path
										{
											path: path.join('.'),
											op: '<>',
											value: null,
										},
									],
								},
								page: page ?? 0,
								perPage: limit ?? 100,
							}),
						},
					)
					const { ok, status: httpStatusCode } = res
					if (!ok)
						throw new ApiError(
							`Failed to fetch device history!`,
							httpStatusCode,
						)
					const items = (await res.json()).list as Record<string, any>[]
					return items.map(({ time, ...rest }) => ({
						...rest,
						ts: new Date(time),
					})) as AssetHistory<T>
				},
				multiHistory: async <T extends Record<string, AssetSensor>>({
					sensors,
					limit,
					page,
					startDate,
					endDate,
				}: {
					sensors: string[]
					limit?: number
					page?: number
					startDate?: Date
					endDate?: Date
				}): Promise<{ [K in keyof T]: AssetHistoryDatum<T[K]> }> => {
					// Build a query for all requested sensors
					const res = await fetch(
						`${base}/projects/${project.id}/devices/${device.id}/stream`,
						{
							method: 'POST',
							headers: {
								...headers,
								Authorization: `Bearer ${await getToken({ id, secret })}`,
							},
							body: JSON.stringify({
								start: (
									startDate ?? sub(new Date(), { months: 1 })
								).toISOString(),
								end: (endDate ?? new Date()).toISOString(),
								query: {
									fields: [
										...sensors.map((sensor) => ({
											path: `${sensor}.v`,
											alias: sensor,
										})),
										{ path: 'time' },
									],
								},
								page: page ?? 0,
								perPage: limit ?? 100,
							}),
						},
					)

					// Go over the items
					const result = {} as { [K in keyof T]: AssetHistoryDatum<T[K]> }
					const items = (await res.json()).list as Record<string, any>[]
					for (const sensor of sensors) {
						const reading = items
							.map(filterNull)
							.find((item) => item[sensor] !== undefined)
						if (reading !== undefined) {
							result[sensor as keyof T] = {
								v: reading[sensor],
								ts: new Date(reading.time as string),
							} as any
						}
					}
					return result
				},
				update: async (patch) => {
					const res = await fetch(
						`${base}/projects/${project.id}/devices/${device.id}`,
						{
							method: 'PATCH',
							headers: {
								...headers,
								Authorization: `Bearer ${await getToken({ id, secret })}`,
							},
							body: JSON.stringify({
								name: patch.name,
							}),
						},
					)
					return toAsset(project)((await res.json()).data)
				},
			}),
		}),
	}
}
