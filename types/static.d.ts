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
		API_ENDPOINT?: string
		PUBLIC_URL?: string
		VERSION?: string
		HOMEPAGE?: string
	}
}
