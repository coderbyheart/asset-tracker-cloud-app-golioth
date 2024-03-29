import { AssetsMap } from 'components/Map/AssetsMap'
import { Navbar } from 'components/Navbar'
import { ApiProvider } from 'hooks/useApi'
import { AssetProvider } from 'hooks/useAsset'
import {
	AuthProvider,
	defaults as authContextDefaults,
	useAuth,
} from 'hooks/useAuth'
import { CurrentChartDateRangeProvider } from 'hooks/useChartDateRange'
import { ProjectProvider } from 'hooks/useProject'
import { About } from 'pages/About'
import { Asset } from 'pages/Asset'
import { Assets } from 'pages/Assets'
import { Login } from 'pages/Login'
import * as ReactDOM from 'react-dom'
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom'

const PUBLIC_API_ENDPOINT = new URL(
	(
		import.meta.env.PUBLIC_API_ENDPOINT ?? 'https://api.golioth.io/v1/'
	)?.replace(/\/$/, ''),
)

const AppRoot = () => {
	const isAuthenticated =
		useAuth().isAuthenticated ?? authContextDefaults.isAuthenticated
	const jwtKey = useAuth().jwtKey ?? authContextDefaults.jwtKey

	return (
		<Router basename={import.meta.env.BASE_URL ?? '/'}>
			<Navbar />
			{!isAuthenticated && (
				<Routes>
					<Route index element={<Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			)}
			{isAuthenticated && jwtKey !== undefined && (
				<ApiProvider jwtKey={jwtKey} endpoint={PUBLIC_API_ENDPOINT}>
					<ProjectProvider>
						<AssetProvider>
							<CurrentChartDateRangeProvider>
								<Routes>
									<Route path="/login" element={<Navigate to="/assets" />} />
									<Route path="/" element={<Navigate to="/assets" />} />
									<Route path="/assets" element={<Assets />} />
									<Route path="/map" element={<AssetsMap />} />
									<Route
										path="/project/:projectId/asset/:assetId"
										element={<Asset />}
									/>
								</Routes>
							</CurrentChartDateRangeProvider>
						</AssetProvider>
					</ProjectProvider>
				</ApiProvider>
			)}
			<Routes>
				<Route
					path="/about"
					element={
						<About
							version={import.meta.env.PUBLIC_VERSION ?? '0.0.0-development'}
							homepage={
								new URL(
									import.meta.env.PUBLIC_HOMEPAGE ??
										'https://github.com/NordicSemiconductor/asset-tracker-cloud-app-golioth-js',
								)
							}
						/>
					}
				/>
			</Routes>
		</Router>
	)
}

ReactDOM.render(
	<AuthProvider apiEndpoint={PUBLIC_API_ENDPOINT}>
		<AppRoot />
	</AuthProvider>,
	document.getElementById('root'),
)
