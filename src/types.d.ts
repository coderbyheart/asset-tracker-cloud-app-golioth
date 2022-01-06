declare module '*.svg' {
	const ref: string
	export default ref
}
declare module '*.png' {
	const ref: string
	export default ref
}

declare module '*.css'

interface ImportMeta {
	hot: {
		accept: Function
		dispose: Function
	}
	env: {
		// Vite built-in
		MODE: string
		BASE_URL?: string
		// Custom
		PUBLIC_API_ENDPOINT?: string
		PUBLIC_VERSION: string
		PUBLIC_HOMEPAGE?: string
		PUBLIC_TWEMOJI_VERSION: string
	}
}
