import { About } from 'app/About'
import { Device } from 'app/Device'
import { Devices } from 'app/Devices'
import { Login } from 'app/Login'
import { ApiProvider } from 'hooks/useApi'
import {
	AuthProvider,
	defaults as authContextDefaults,
	useAuth,
} from 'hooks/useAuth'
import { GlobalChartDateRangeProvider } from 'hooks/useChartDateRange'
import { GlobalDeviceProvider } from 'hooks/useGlobalDevice'
import { MapSettingsProvider } from 'hooks/useMapSettings'
import React from 'react'
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom'
import { Navbar } from 'theme/Navbar'

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
		<GlobalDeviceProvider>
			<GlobalChartDateRangeProvider>
				<Router basename={import.meta.env.BASE_URL ?? '/'}>
					<header>
						<Navbar />
					</header>
					<MapSettingsProvider>
						<main className="container mt-4">
							{!isAuthenticated && (
								<Routes>
									<Route index element={<Navigate to="/login" />} />
									<Route path="/login" element={<Login />} />
								</Routes>
							)}
							{isAuthenticated && jwtKey !== undefined && (
								<ApiProvider jwtKey={jwtKey} endpoint={PUBLIC_API_ENDPOINT}>
									<Routes>
										<Route path="/login" element={<Navigate to="/devices" />} />
										<Route path="/" element={<Navigate to="/devices" />} />
										<Route path="/devices" element={<Devices />} />
										<Route
											path="/project/:projectId/device/:deviceId"
											element={<Device />}
										/>
									</Routes>
								</ApiProvider>
							)}
							<Routes>
								<Route
									path="/about"
									element={
										<About
											version={
												import.meta.env.PUBLIC_VERSION ?? '0.0.0-development'
											}
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
						</main>
					</MapSettingsProvider>
				</Router>
			</GlobalChartDateRangeProvider>
		</GlobalDeviceProvider>
	)
}

export const App = () => (
	<AuthProvider apiEndpoint={PUBLIC_API_ENDPOINT}>
		<AppRoot />
	</AuthProvider>
)
