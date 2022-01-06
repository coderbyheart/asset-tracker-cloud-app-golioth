import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

const {
	version,
	homepage,
	dependencies: { twemoji },
} = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)

process.env.PUBLIC_VERSION ?? version ?? Date.now()
process.env.PUBLIC_HOMEPAGE = homepage
process.env.PUBLIC_TWEMOJI_VERSION = twemoji

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: `${(process.env.BASE_URL ?? '').replace(/\/+$/, '')}/`,
	preview: {
		host: 'localhost',
		port: 8080,
	},
	server: {
		host: 'localhost',
		port: 8080,
	},
	resolve: {
		alias: [
			{ find: 'golioth/', replacement: '/src/golioth/' },
			{ find: 'asset/', replacement: '/src/asset/' },
			{ find: 'hooks/', replacement: '/src/hooks/' },
			{ find: 'components/', replacement: '/src/components/' },
			{ find: 'themed/', replacement: '/src/themed/' },
			{ find: 'utils/', replacement: '/src/utils/' },
		],
	},
	build: {
		outDir: './build',
	},
	envPrefix: 'PUBLIC_',
})
