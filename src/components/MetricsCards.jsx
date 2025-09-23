"use client";

import React from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const metrics = [
  { title: "Revenue", value: "$12,340" },
  { title: "Active Users", value: "1,245" },
  { title: "Pending Tasks", value: "18" },
  { title: "Conversion Rate", value: "4.8%" },
];

export default function MetricsCards({ tasks }) {

  const upcommingTasks = tasks
  .filter((t) => !t.completed)
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  .slice(0, 3);

  return (
    <Box sx={{display: 'flex',gap: 2, mb: 4}}>
      {
        upcommingTasks.length > 0 ? (
          upcommingTasks.map((task, i) => (
            <Card
            key={i}
            sx={{
              flex: 1,
              p: 2,
              border: "1px solid #e0e0e0",
              boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)",
            }}
            >
               <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsActiveIcon color="success" />
                <Typography variant="h6">{task.task}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Due: {task.dueDate}
              </Typography>
              {task.topic && (
                <Typography variant="body2">Topic: {task.topic}</Typography>
              )}
            </CardContent>
            </Card>
          ))
         ) : (
        <Typography>No upcoming tasks</Typography>
      )
      }
       {/* 🔹 Simple glowing animation for bell */}
      <style>
        {`
          @keyframes glow {
            from { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
            to { box-shadow: 0 0 15px rgba(0,255,0,0.6); }
          }
        `}
      </style>
    </Box>
  )
}
