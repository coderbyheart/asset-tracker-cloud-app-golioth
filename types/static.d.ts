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
		MODE: string
		SNOWPACK_PUBLIC_API_ENDPOINT?: string
		SNOWPACK_PUBLIC_BASE_URL?: string
	}
}
