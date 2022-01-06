import { objectFlagsToArray } from 'golioth/utils/objectFlagsToArray'

describe('objectFlagsToArray', () => {
	it('should convert an object to an array', () =>
		expect(
			objectFlagsToArray({
				gnss: true,
				ncell: true,
			}),
		).toEqual(['gnss', 'ncell']))
	it('should convert an object to an array (with inversed flag)', () =>
		expect(
			objectFlagsToArray(
				{
					gnss: true,
					ncell: false,
				},
				false,
			),
		).toEqual(['ncell']))
	it('should handle null', () => expect(objectFlagsToArray(null)).toEqual([]))
	it('should handle undefined', () =>
		expect(objectFlagsToArray(undefined)).toEqual([]))
})
