import React, { useEffect, useState } from 'react'

export default function TestCode() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const nextFiveYears = Array.from({ length: 5 }, (_ , index) => currentYear + index);
        setYears(nextFiveYears);

        const currentMonth = new Date().getMonth();
        const monthsForSelectedYear = selectedYear === currentYear
         ? Array.from({ length: 12 - currentMonth }, (_ , index) => new Date(currentYear, currentMonth + index, 1).toLocaleString('en-US', { month: 'long'}))
         : Array.from({ length: 12 }, (_ , index) => new Date(currentYear, index, 1).toLocaleString('en-US', { month: 'long'}));
        setMonths(monthsForSelectedYear)
    }, [selectedYear])

  return (
    <div>
        <form>
            <label>Select Year
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Select Month:
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </label>
        </form>
    </div>
  )
}
