"use client"

import * as React from "react"
import dayjs from "dayjs"
import { DateCalendar, PickersDay } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { styled } from "@mui/material/styles"
import QuotesCarousel from "./QuoteCard"

// Theme colors for consistency
const indigoTint = "rgba(99, 102, 241, 0.4)" // 40% indigo
const indigoSolid = "rgb(99, 102, 241)"

// Custom styled day for calendar
const CustomDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isToday" && prop !== "isReminder",
})(({ isToday, isReminder }) => ({
  borderRadius: "12px",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  ...(isToday && {
    border: `2px solid ${indigoSolid}`,
    boxShadow: `0 0 6px ${indigoSolid}`,
    color: indigoSolid,
    fontWeight: 600,
  }),
  ...(isReminder && {
    backgroundColor: indigoTint,
    color: indigoSolid,
    fontWeight: 500,
  }),
  "&:hover, &:focus": {
    transform: "scale(1.05)",
    boxShadow: `0 2px 6px rgba(99,102,241,0.25)`,
    backgroundColor: indigoTint,
  },
}))

const RemindersCalendar = ({ tasks = [] }) => {
  const today = dayjs().format("YYYY-MM-DD")

  // Memoize reminder dates for performance
  const reminderDates = React.useMemo(
    () =>
      tasks
        .map((t) => (t.dueDate ? dayjs(t.dueDate).format("YYYY-MM-DD") : null))
        .filter(Boolean),
    [tasks]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto p-6">

      {/* Quotes Carousel */}
      <div
        className="flex items-center justify-center w-full max-w-full"
        aria-label="Motivational Quotes Carousel"
      >
        <QuotesCarousel />
      </div>

      {/* Calendar */}
      <div
        className="p-3 rounded-xl bg-indigo-400/40 dark:bg-indigo-900/40 
                   backdrop-blur-md transition-all duration-200
                   hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(99,102,241,0.12)]
                   w-full flex flex-col"
      >
        <h2 className="text-lg font-semibold mb-2 tracking-tight">Calendar</h2>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            sx={{
              "& .MuiDayCalendar-weekDayLabel": { fontSize: "0.7rem" },
              "& .MuiPickersDay-root": { fontSize: "0.75rem", width: 32, height: 32 },
              width: "100%", // Force calendar to fill container
            }}
            slots={{
              day: (props) => {
                const { day, outsideCurrentMonth, ...other } = props
                const dateStr = day.format("YYYY-MM-DD")
                const isToday = dateStr === today
                const isReminder = reminderDates.includes(dateStr)

                return (
                  <CustomDay
                    {...other}
                    outsideCurrentMonth={outsideCurrentMonth}
                    day={day}
                    isToday={isToday}
                    isReminder={isReminder}
                    aria-current={isToday ? "date" : undefined}
                  />
                )
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default RemindersCalendar
