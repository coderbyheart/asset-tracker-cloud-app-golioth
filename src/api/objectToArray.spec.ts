import { objectToArray } from './objectToArray'

describe('objectToArray', () => {
	it('should convert an object to an array', () =>
		expect(
			objectToArray({
				'0': 'gnss',
				'1': 'ncell',
			}),
		).toEqual(['gnss', 'ncell']))
	it('should handle null', () => expect(objectToArray(null)).toEqual([]))
	it('should handle undefined', () =>
		expect(objectToArray(undefined)).toEqual([]))
})
