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
const dummyTasks = [
  { id: 1, task: "Complete Biology Chapter 3", dueDate: "2025-01-12", subject: "Biology", completed: true },
  { id: 2, task: "Math Assignment 5", dueDate: "2025-02-20", subject: "Mathematics", completed: false },
  { id: 3, task: "History Essay Draft", dueDate: "2025-03-05", subject: "History", completed: false },
  { id: 4, task: "Chemistry Lab Report", dueDate: "2025-04-18", subject: "Chemistry", completed: true },
  { id: 5, task: "English Literature Review", dueDate: "2025-05-09", subject: "English", completed: false },
  { id: 6, task: "Physics Problem Set", dueDate: "2025-06-14", subject: "Physics", completed: true },
  { id: 7, task: "Art Project Sketch", dueDate: "2025-07-22", subject: "Art", completed: false },
  { id: 8, task: "Computer Science Mini Project", dueDate: "2025-08-30", subject: "Computer Science", completed: true },
  { id: 9, task: "Geography Map Exercise", dueDate: "2025-09-11", subject: "Geography", completed: false },
  { id: 10, task: "Economics Case Study", dueDate: "2025-10-25", subject: "Economics", completed: false },
  { id: 11, task: "Philosophy Reflection Paper", dueDate: "2025-11-05", subject: "Philosophy", completed: true },
  { id: 12, task: "Music Composition Practice", dueDate: "2025-12-19", subject: "Music", completed: false },
  { id: 13, task: "Biology Lab Analysis", dueDate: "2025-03-28", subject: "Biology", completed: true },
  { id: 14, task: "Math Exam Preparation", dueDate: "2025-06-03", subject: "Mathematics", completed: false },
  { id: 15, task: "History Final Project", dueDate: "2025-09-17", subject: "History", completed: false }
];

  return (
    <main className="flex-1 p-6 space-y-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">Important Reminders ‼</h1>

      {/* Metrics Cards */}
      <MetricsCards tasks={dummyTasks} />

      {/* Charts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
            <DrilldownMonthPie tasks={dummyTasks} />
          </div>

          {/* Calendar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
            <RemindersCalendar tasks={dummyTasks} />
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Reminders</h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
          <TasksTable tasks={dummyTasks} setTasks={setTasks} />
        </div>
      </section>
    </main>
  )
}

export default MainContent
