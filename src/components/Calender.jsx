"use client"

import * as React from "react"
import dayjs from "dayjs"
import { DateCalendar, PickersDay } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { styled } from "@mui/material/styles"

// Custom styled day for highlighting
const CustomDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isToday" && prop !== "isReminder",
})(({ isToday, isReminder }) => ({
  ...(isToday && {
    backgroundColor: "green",
    color: "white",
    "&:hover, &:focus": {
      backgroundColor: "darkgreen",
    },
  }),
  ...(isReminder && {
    backgroundColor: "red",
    color: "white",
    "&:hover, &:focus": {
      backgroundColor: "darkred",
    },
  }),
}))

const RemindersCalendar = ({ tasks = [] }) => {
  // Collect all reminder dates from tasks
  const reminderDates = tasks
    .map((t) => (t.dueDate ? dayjs(t.dueDate).format("YYYY-MM-DD") : null))
    .filter(Boolean)

  const today = dayjs().format("YYYY-MM-DD")

  return (
    <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>

      {/* Wrap in LocalizationProvider */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
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
                />
              )
            },
          }}
        />
      </LocalizationProvider>
    </div>
  )
}

export default RemindersCalendar
