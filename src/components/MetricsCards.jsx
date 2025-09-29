"use client";

import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Box, Card, CardContent, Typography } from "@mui/material";
import HoverWrapper from "./HoverWrapper";

/**
 * MetricsCards
 * - Shows the next 3 upcoming (incomplete) tasks.
 * - Defensive: tolerates missing/invalid dates and missing tasks array.
 * - Accessibility: cards have aria-labels describing task + due date.
 */

export default function MetricsCards({ tasks }) {
  // Inject the glow keyframes only once to avoid duplicate <style> tags
  React.useEffect(() => {
    const STYLE_ID = "metrics-cards-glow-keyframes";
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.innerHTML = `
        @keyframes sb-glow {
          0% { filter: drop-shadow(0 0 4px rgba(79,70,229,0.4)); }
          100% { filter: drop-shadow(0 0 12px rgba(79,70,229,0.8)); }
        }
      `;
      document.head.appendChild(style);
    }
    // no cleanup: we want this style to persist for the app life
  }, []);

  // Defensive normalization of incoming tasks
  const safeTasks = React.useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

  // Compute upcoming tasks: incomplete, sorted by dueDate (earliest first), top 3
  const upcomingTasks = React.useMemo(() => {
    // Helper: parse date, return timestamp or large number for invalid/missing date
    const getTime = (dateStr) => {
      if (!dateStr) return Number.POSITIVE_INFINITY;
      const d = dayjs(dateStr);
      if (d.isValid()) return d.valueOf();
      // try common alternative formats
      const altFormats = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD", "DD.MM.YYYY"];
      for (const fmt of altFormats) {
        const dd = dayjs(dateStr, fmt);
        if (dd.isValid()) return dd.valueOf();
      }
      return Number.POSITIVE_INFINITY;
    };

    return safeTasks
      .filter((t) => !t?.completed) // only incomplete
      .slice() // shallow copy before sort
      .sort((a, b) => {
        const ta = getTime(a?.dueDate ?? a?.due ?? "");
        const tb = getTime(b?.dueDate ?? b?.due ?? "");
        return ta - tb;
      })
      .slice(0, 3); // take top 3 upcoming
  }, [safeTasks]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
        },
        gap: 3,
        mb: 6,
        alignItems: "stretch",
      }}
      aria-live="polite"
    >
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task, idx) => {
          const idKey = task?.id ?? `metrics-task-${idx}`;
          // Format due date for display; fallback to raw string if parse fails
          const rawDue = task?.dueDate ?? task?.due ?? "";
          const parsed = dayjs(rawDue);
          const dueDisplay = parsed.isValid() ? parsed.format("MMM D, YYYY") : rawDue || "No date";

          return (
            <HoverWrapper key={idKey}>
              <Card
                role="article"
                aria-label={`Upcoming task: ${task?.task ?? "Untitled task"} — Due ${dueDisplay}`}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                elevation={0}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Bell icon + task title */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <NotificationsActiveIcon
                      sx={{
                        fontSize: 28,
                        color: "#4f46e5",
                        animation: "sb-glow 1.5s infinite alternate",
                        // fallback boxShadow for older browsers
                        WebkitFilter: "drop-shadow(0 0 6px rgba(79,70,229,0.5))",
                      }}
                      aria-hidden="true"
                    />
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                      {task?.task ?? "Untitled Task"}
                    </Typography>
                  </Box>

                  {/* Due date */}
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                    📅 Due: <strong>{dueDisplay}</strong>
                  </Typography>

                  {/* Optional topic/subject */}
                  { (task?.topic || task?.subject) && (
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 2,
                        display: "inline-block",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#4f46e5",
                        mt: 1,
                      }}
                    >
                      Topic: {task?.topic ?? task?.subject}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </HoverWrapper>
          );
        })
      ) : (
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No upcoming tasks 🚫
        </Typography>
      )}
    </Box>
  );
}

MetricsCards.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      task: PropTypes.string,
      dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      due: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      completed: PropTypes.bool,
      topic: PropTypes.string,
      subject: PropTypes.string,
    })
  ),
};

MetricsCards.defaultProps = {
  tasks: [],
};
