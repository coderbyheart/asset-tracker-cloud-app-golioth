import React, {
	createContext,
	useContext,
	FunctionComponent,
	useState,
} from 'react'
import { sub } from 'date-fns'
import { dateFreezer, withLocalStorage } from 'utils/withLocalStorage'

const defaultStart = sub(new Date(), { months: 1 })

const storedStartDate = withLocalStorage<Date>({
	key: 'chart:startDate',
	defaultValue: defaultStart,
	freezer: dateFreezer,
})

const defaultEnd = new Date()
const storedEndDate = withLocalStorage<Date>({
	key: 'chart:endDate',
	defaultValue: defaultEnd,
	freezer: dateFreezer,
})

export const GlobalChartDateRangeContext = createContext<{
	startDate: Date
	endDate: Date
	setStartDate: (_: Date) => void
	setEndDate: (_: Date) => void
	defaultStart: Date
	defaultEnd: Date
}>({
	startDate: storedStartDate.get(),
	endDate: storedEndDate.get(),
	setStartDate: () => undefined,
	setEndDate: () => undefined,
	defaultStart,
	defaultEnd,
})

export const useChartDateRange = () => useContext(GlobalChartDateRangeContext)

export const GlobalChartDateRangeProvider: FunctionComponent = ({
	children,
}) => {
	const [startDate, setStartDate] = useState<Date>(storedStartDate.get())
	const [endDate, setEndDate] = useState<Date>(storedEndDate.get())
	return (
		<GlobalChartDateRangeContext.Provider
			value={{
				startDate,
				endDate,
				setStartDate: (startDate) => {
					if (startDate.getTime() > endDate.getTime()) return
					setStartDate(startDate)
					storedStartDate.set(startDate)
				},
				setEndDate: (endDate) => {
					if (endDate.getTime() < startDate.getTime()) return
					setEndDate(endDate)
					storedEndDate.set(endDate)
				},
				defaultStart,
				defaultEnd,
			}}
		>
			{children}
		</GlobalChartDateRangeContext.Provider>
	)
}
