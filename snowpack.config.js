process.env.SNOWPACK_PUBLIC_VERSION = process.env.VERSION || Date.now()

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		public: '/',
		src: '/_dist_',
	},
	plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
	packageOptions: {
		installTypes: true,
		env: {
			SNOWPACK_PUBLIC_VERSION: true,
		},
	},
	buildOptions: {
		...(process.env.SNOWPACK_PUBLIC_BASE_URL !== undefined && {
			baseUrl: `${process.env.SNOWPACK_PUBLIC_BASE_URL.replace(/\/+$/, '')}/`,
		}),
	},
}
