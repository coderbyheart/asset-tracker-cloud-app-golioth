import { filterNull } from 'golioth/utils/filterNull'

describe('filterNull()', () => {
	it('should filter out null values from an object', () =>
		expect(
			filterNull({
				bat: null,
				dev: null,
				env: null,
				gnss: null,
				roam: {
					area: 30401,
					band: 666,
					cell: 16964098,
					ip: null,
					mccmnc: 24201,
					nw: 'LAN',
					rsrp: 70,
				},
				nod: ['foo', 'bar'],
				time: '2021-12-15T16:11:04.219+00:00',
			}),
		).toEqual({
			roam: {
				area: 30401,
				band: 666,
				cell: 16964098,
				mccmnc: 24201,
				nw: 'LAN',
				rsrp: 70,
			},
			nod: ['foo', 'bar'],
			time: '2021-12-15T16:11:04.219+00:00',
		}))
})
