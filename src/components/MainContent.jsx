"use client"

import * as React from "react"
import { useState } from "react"
import TasksTable from "./TasksTable" 
import MetricsCards from "./MetricsCards"
import DrilldownMonthPie from "./DrilldownMonthPie"
import RemindersCalendar from "./Calender"

const MainContent = () => {
  // Handling Tasks for data fetching
  const [tasks, setTasks] = useState([])

  return (
    <main className="flex-1 p-6 space-y-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">Important Reminders ‼</h1>

      {/* Metrics Cards */}
      <MetricsCards tasks={tasks} />

      {/* Charts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
            <DrilldownMonthPie tasks={tasks} />
          </div>

          {/* Calendar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
            <RemindersCalendar tasks={tasks} />
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Reminders</h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
          <TasksTable tasks={tasks} setTasks={setTasks} />
        </div>
      </section>
    </main>
  )
}

export default MainContent
