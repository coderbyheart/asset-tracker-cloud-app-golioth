import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalDevice } from '../../hooks/useGlobalDevice'
import styled from 'styled-components'
import { useAuth } from '../../hooks/useAuth'
import { emojify } from './Emojify'
import logo from './logo.svg'

const StyledLink = styled(Link)`
	color: #eee;
	text-decoration: none;
	margin-right: 1rem;
	&:hover {
		color: #fff;
	}
`

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth()
	const { info } = useGlobalDevice()
	return (
		<nav
			className="navbar navbar-light"
			style={{
				background: 'linear-gradient(79.13deg,#2fe077,#61d2c9 48.78%,#6a70db)',
			}}
		>
			<div className="container">
				<Link className="navbar-brand" to="/">
					<img
						src={logo}
						alt=""
						width="30"
						height="24"
						className="d-inline-block align-text-top"
					/>
					{info && <span>{info.name}</span>}
					{!info && (
						<span>
							nRF Asset Tracker <small>(Golioth)</small>
						</span>
					)}
				</Link>
				{isAuthenticated && (
					<div>
						<StyledLink to="/devices">{emojify(`🐱 Devices`)}</StyledLink>
						<StyledLink to="/about">{emojify(`💁 About`)}</StyledLink>
						<button type="button" className="btn btn-light" onClick={logout}>
							Log out
						</button>
					</div>
				)}
			</div>
		</nav>
	)
}
