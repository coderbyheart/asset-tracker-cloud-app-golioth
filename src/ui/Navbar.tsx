import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../golioth/hooks/useAuth'
import { emojify } from './components/Emojify'
import logo from './logo.svg'

const StyledLink = styled(Link)`
	color: inherit;
	text-decoration: none;
`

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth()
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
					nRF Asset Tracker <small>(Golioth)</small>
				</Link>
				{isAuthenticated && (
					<>
						<StyledLink to="/devices">{emojify(`🐱 Devices`)}</StyledLink>
						<StyledLink to="/about">{emojify(`💁 About`)}</StyledLink>
						<button type="button" className="btn btn-light" onClick={logout}>
							Log out
						</button>
					</>
				)}
			</div>
		</nav>
	)
}
