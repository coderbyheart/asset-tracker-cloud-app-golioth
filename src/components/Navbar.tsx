import {
	HelpIcon,
	IconWithText,
	InfoIcon,
	LogoutIcon,
	MapIcon,
	ParcelIcon,
} from 'components/FeatherIcon'
import { useAsset } from 'hooks/useAsset'
import { useAuth } from 'hooks/useAuth'
import introJs from 'intro.js'
import { Link } from 'react-router-dom'
import logo from '/logo.svg'

const intro = introJs()

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth()
	const { device } = useAsset()
	return (
		<header>
			<nav
				className="navbar navbar-expand-lg navbar-light bg-light"
				style={{
					background:
						'linear-gradient(79.13deg,#2fe077,#61d2c9 48.78%,#6a70db)',
				}}
			>
				<div className="container-fluid">
					<Link className="navbar-brand" to="/">
						<img
							src={logo}
							alt=""
							width="30"
							height="24"
							className="d-inline-block align-text-top me-1"
						/>
						{device && <span>{device.name}</span>}
						{!device && (
							<span>
								nRF Asset Tracker <small>(Golioth)</small>
							</span>
						)}
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarTogglerDemo02"
						aria-controls="navbarTogglerDemo02"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link className="nav-link" to="/assets">
									<ParcelIcon /> Assets
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/map">
									<IconWithText>
										<MapIcon /> Map
									</IconWithText>
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/about">
									<IconWithText>
										<InfoIcon /> About
									</IconWithText>
								</Link>
							</li>
							<li className="nav-item">
								<button
									type="button"
									className="btn btn-link nav-link"
									style={{ fontWeight: 'var(--bs-body-font-weight)' }}
									onClick={() => {
										intro.start()
									}}
								>
									<IconWithText>
										<HelpIcon /> Help
									</IconWithText>
								</button>
							</li>
						</ul>

						{isAuthenticated && (
							<form className="d-flex">
								<button
									type="button"
									className="btn btn-outline-light"
									onClick={logout}
								>
									<IconWithText>
										<LogoutIcon />
										Log out
									</IconWithText>
								</button>
							</form>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}
