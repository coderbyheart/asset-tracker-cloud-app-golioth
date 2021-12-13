import fs from 'fs'
import path from 'path'

const { version, homepage } = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)
const VERSION = process.env.VERSION ?? version ?? Date.now()
const PUBLIC_URL = process.env.PUBLIC_URL
const API_ENDPOINT = process.env.API_ENDPOINT

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
			VERSION: true,
		},
	},
	buildOptions: {
		...(PUBLIC_URL !== undefined && {
			baseUrl: `${PUBLIC_URL.replace(/\/+$/, '')}/`,
		}),
	},
	env: {
		API_ENDPOINT,
		PUBLIC_URL,
		VERSION,
		HOMEPAGE: homepage,
	},
	alias: {
		api: './src/api',
		hooks: './src/hooks',
		ui: './src/ui',
		utils: './src/utils',
	},
}
