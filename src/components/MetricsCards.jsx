"use client";

import React from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Box, Card, CardContent, Typography } from "@mui/material";
import HoverWrapper from "./HoverWrapper";

export default function MetricsCards({ tasks }) {
  // ---------- Get the first 3 upcoming tasks ----------
  const upcomingTasks = tasks
    .filter((t) => !t.completed) // only incomplete tasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // sort by dueDate ascending
    .slice(0, 3); // take top 3

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // 1 column on mobile
          sm: "1fr 1fr", // 2 columns on tablet
          md: "1fr 1fr 1fr", // 3 columns on desktop
        },
        gap: 3,
        mb: 6,
        alignItems: "stretch",
      }}
    >
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => (
          <HoverWrapper key={task.id}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", // soft indigo gradient
                 display: "flex",         
    flexDirection: "column", 
    height: "100%",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Bell icon + task title */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <NotificationsActiveIcon
                    sx={{
                      fontSize: 28,
                      color: "#4f46e5", // indigo
                      animation: "glow 1.5s infinite alternate",
                    }}
                  />
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    {task.task}
                  </Typography>
                </Box>

                {/* Task due date */}
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 0.5 }}
                >
                  📅 Due: <strong>{task.dueDate}</strong>
                </Typography>

                {/* Optional topic */}
                {task.topic && (
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "rgba(79, 70, 229, 0.08)", // indigo tint
                      px: 1.2,
                      py: 0.5,
                      borderRadius: 2,
                      display: "inline-block",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "#4f46e5",
                    }}
                  >
                    Topic: {task.topic}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </HoverWrapper>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No upcoming tasks 🚫
        </Typography>
      )}

      {/* ---------- Glowing animation keyframes ---------- */}
      <style>
        {`
          @keyframes glow {
            0% { filter: drop-shadow(0 0 4px rgba(79,70,229,0.4)); }
            100% { filter: drop-shadow(0 0 12px rgba(79,70,229,0.8)); }
          }
        `}
      </style>
    </Box>
  );
}
