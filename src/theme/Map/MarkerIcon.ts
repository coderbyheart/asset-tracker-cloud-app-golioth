import { icon, Point } from 'leaflet'
import logo from '/logo.svg'

export const markerIcon = icon({
	iconUrl: logo,
	iconSize: new Point(50, 50),
	iconAnchor: new Point(25, 30),
})
