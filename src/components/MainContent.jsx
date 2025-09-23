"use client"


import * as React from "react"
import TasksTable from "./TasksTable" 
import MetricsCards from "./MetricsCards"
import { useState } from "react"

const MainContent = () => {

    //Handling Tasks for data fetching
    const [tasks, setTasks] = useState([])
  
    return (
    <main className="flex-1 p-6">
      {/* Metrics Cards (upar ke section) */}
      <h1 className="text-4xl font-semibold mb-4 rounded-4xl ">Important Reminders ‼ </h1>
      <MetricsCards tasks={tasks} />

      {/* Charts (neeche add honge) */}

      {/* Calendar (charts ke sath show karenge) */}

      {/* Table section */}
      <section className="mt-6">
        <h1 className="text-4xl font-semibold mb-4">Reminders</h1>
        <TasksTable tasks={tasks} setTasks={setTasks} />    
      </section>
    </main>
  )
}

export default MainContent
