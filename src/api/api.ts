import { sub } from 'date-fns'
import type {
	DeviceHistory,
	DeviceHistoryDatum,
	DeviceSensor,
	DeviceState,
} from 'device/state'
import { DataModules } from 'device/state'
import * as jose from 'jose'
import rfdc from 'rfdc'
import { filterNull } from 'utils/filterNull'
import { objectFlagsToArray } from './objectFlagsToArray'

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

export type GoliothProject = {
	id: string
	name: string
	createdAt: Date
	updatedAt: Date
}

export type GoliothDevice = {
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

const toDevice = (project: Pick<GoliothProject, 'id'>) => (d: any) =>
	({
		...d,
		createdAt: new Date(d.createdAt),
		updatedAt: new Date(d.updatedAt),
		lastReport: new Date(d.lastReport),
		projectId: project.id,
	} as GoliothDevice)

export const api = ({
	jwtKey: { id, secret },
	endpoint,
}: {
	jwtKey: JWTKey
	endpoint: URL
}): {
	projects: () => Promise<GoliothProject[]>
	project: (_: Pick<GoliothProject, 'id'>) => {
		devices: () => Promise<GoliothDevice[]>
		device: (_: Pick<GoliothDevice, 'id'>) => {
			get: () => Promise<GoliothDevice>
			state: {
				get: () => Promise<Record<string, any>>
				update: (_: DeviceState) => Promise<void>
			}
			history: <T extends DeviceSensor>(
				_: {
					path: string[]
				} & QueryParameters,
			) => Promise<DeviceHistory<T>>
			multiHistory: <T extends Record<string, DeviceSensor>>(
				_: {
					sensors: string[]
				} & QueryParameters,
			) => Promise<{ [K in keyof T]: DeviceHistoryDatum<T[K]> }>
			update: (_: { name: string }) => Promise<GoliothDevice>
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
		project: (project: Pick<GoliothProject, 'id'>) => ({
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
				return Object.values(list as Record<string, any>).map(toDevice(project))
			},
			device: (device: Pick<GoliothDevice, 'id'>) => ({
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
					return toDevice(project)((await res.json()).data)
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
				history: async <T extends DeviceSensor>({
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
					})) as DeviceHistory<T>
				},
				multiHistory: async <T extends Record<string, DeviceSensor>>({
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
				}): Promise<{ [K in keyof T]: DeviceHistoryDatum<T[K]> }> => {
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
					const result = {} as { [K in keyof T]: DeviceHistoryDatum<T[K]> }
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
					return toDevice(project)((await res.json()).data)
				},
			}),
		}),
	}
}
