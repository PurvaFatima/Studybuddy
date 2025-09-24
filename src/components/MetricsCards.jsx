"use client";

import React from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function MetricsCards({ tasks }) {
  // ---------- Get the first 3 upcoming tasks ----------
  const upcomingTasks = tasks
    .filter((t) => !t.completed) // only incomplete tasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // sort by dueDate ascending
    .slice(0, 3); // take top 3

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => (
          <Card
            key={task.id} // unique key for React
            sx={{
              flex: 1, // equal width
              p: 2,
              border: "1px solid #e0e0e0",
              boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" }, // subtle hover effect
            }}
          >
            <CardContent>
              {/* Bell icon + task title */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsActiveIcon
                  color="success"
                  sx={{
                    animation: "glow 1s infinite alternate", // glowing animation
                  }}
                />
                <Typography variant="h6">{task.task}</Typography>
              </Box>

              {/* Task due date */}
              <Typography variant="body2" color="text.secondary">
                Due: {task.dueDate}
              </Typography>

              {/* Optional topic */}
              {task.topic && (
                <Typography variant="body2">Topic: {task.topic}</Typography>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No upcoming tasks</Typography>
      )}

      {/* ---------- Glowing animation keyframes ---------- */}
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
            100% { box-shadow: 0 0 15px rgba(0,255,0,0.6); }
          }
        `}
      </style>
    </Box>
  );
}
