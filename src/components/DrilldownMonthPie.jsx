"use client";

import React from "react";
import { Card, CardContent, CardHeader, Typography, Button, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/* Colors */
const MONTH_COLORS = [
  "#6366F1","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4",
  "#F97316","#0EA5E9","#14B8A6","#A78BFA","#F43F5E","#60A5FA",
];
const STATUS_COLORS = ["#10B981", "#F43F5E"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Robust date parser returning {month, year} or null */
function getMonthIndexFromDateString(dateStr) {
  if (!dateStr) return null;
  // quick guard for non-string
  const s = typeof dateStr === "string" ? dateStr.trim() : String(dateStr);
  if (!s) return null;

  // Try native parsing first
  const t = Date.parse(s);
  if (!isNaN(t)) {
    const d = new Date(t);
    return { month: d.getMonth(), year: d.getFullYear() };
  }

  // Fallback: try YYYY-MM-DD or YYYY/MM/DD manually
  const parts = s.split(/[-\/\.]/).map(p => p.trim());
  if (parts.length >= 3) {
    const y = Number(parts[0]), m = Number(parts[1]) - 1, day = Number(parts[2]);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(day)) {
      const d = new Date(y, m, day);
      if (!isNaN(d.getTime())) return { month: d.getMonth(), year: d.getFullYear() };
    }
  }

  // give up
  return null;
}

/**
 * DrilldownMonthPie (debug-friendly)
 * Props:
 *  - tasks: Array<{ id, task, dueDate, completed }>
 */
export default function DrilldownMonthPie({ tasks = [] }) {
  // drill state
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(null);
  const currentYear = new Date().getFullYear();

  // defensive tasks alias
  const safeTasks = React.useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

  // Keep a small error state to show friendly message if something goes wrong
  const [errorMessage, setErrorMessage] = React.useState(null);

  // compute month counts (defensive)
  const { monthCounts, invalidDates } = React.useMemo(() => {
    const counts = new Array(12).fill(0);
    const invalid = [];

    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? ""; // accept either property
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed) {
          if (dateStr) invalid.push({ id: t.id, due: dateStr });
          continue;
        }
        if (parsed.year !== currentYear) continue; // only current year
        counts[parsed.month] += 1;
      } catch (err) {
        // never throw — collect as invalid
        invalid.push({ id: t?.id ?? null, due: t?.dueDate ?? t?.due ?? "?" });
      }
    }

    return { monthCounts: counts, invalidDates: invalid };
  }, [safeTasks, currentYear]);

  // yearlyData (only months with tasks)
  const yearlyData = React.useMemo(() => {
    return monthCounts
      .map((count, idx) => ({ monthIndex: idx, name: MONTH_NAMES[idx], value: count }))
      .filter(m => m.value > 0);
  }, [monthCounts]);

  // monthly status for selected month
  const monthlyStatusData = React.useMemo(() => {
    if (selectedMonthIndex === null) return [];
    let completed = 0, incomplete = 0;
    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? "";
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed) continue;
        if (parsed.year !== currentYear) continue;
        if (parsed.month !== selectedMonthIndex) continue;
        if (t.completed) completed += 1;
        else incomplete += 1;
      } catch (err) {
        // ignore individual errors
      }
    }
    return [{ name: "Completed", value: completed }, { name: "Incomplete", value: incomplete }];
  }, [safeTasks, selectedMonthIndex, currentYear]);

  // total in selected month (for header)
  const selectedMonthTotal = monthlyStatusData.reduce((s, x) => s + (x?.value || 0), 0);

  // Debug logs — helpful to paste here if things fail
  React.useEffect(() => {
    console.groupCollapsed("DrilldownMonthPie debug");
    console.log("safeTasks.length:", safeTasks.length);
    console.log("invalidDates (non-empty means some tasks have bad due strings):", invalidDates);
    console.log("monthCounts:", monthCounts);
    console.log("yearlyData:", yearlyData);
    console.log("selectedMonthIndex:", selectedMonthIndex);
    console.log("monthlyStatusData:", monthlyStatusData);
    console.groupEnd();
    // If there are a lot of invalids, show a small error hint in the UI:
    if (invalidDates.length > 0) {
      setErrorMessage(`${invalidDates.length} task(s) had invalid or missing dates and were ignored in the chart.`);
    } else {
      setErrorMessage(null);
    }
  }, [safeTasks, invalidDates, monthCounts, yearlyData, selectedMonthIndex, monthlyStatusData]);

  // click handler - logs payload
  const handleMonthSliceClick = (payload) => {
    try {
      if (!payload || typeof payload.monthIndex === "undefined") return;
      console.log("Month slice clicked payload:", payload);
      setSelectedMonthIndex(payload.monthIndex);
    } catch (err) {
      console.error("slice click error", err);
    }
  };

  // If the chart would be empty, show a friendly message
  const totalThisYear = monthCounts.reduce((s, v) => s + v, 0);

  return (
    <Card className="w-full">
      <CardHeader
        title={
          selectedMonthIndex === null
            ? `Tasks This Year (${currentYear})`
            : `${MONTH_NAMES[selectedMonthIndex]} — ${selectedMonthTotal} task${selectedMonthTotal !== 1 ? "s" : ""}`
        }
        subheader={selectedMonthIndex === null ? "Click a month slice to drill down" : "Showing completed vs incomplete"}
      />

      <CardContent>
        {/* show error message if parsing problems found */}
        {errorMessage && (
          <Box className="mb-2">
            <Typography variant="body2" color="error">{errorMessage}</Typography>
            <Typography variant="caption" color="textSecondary">
              Open console to see the invalid date values.
            </Typography>
          </Box>
        )}

        {/* if there are no tasks for the year */}
        {totalThisYear === 0 ? (
          <Typography variant="body2" color="textSecondary">No tasks for {currentYear} to display.</Typography>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {selectedMonthIndex === null ? (
                  <>
                    <Pie
                      data={yearlyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      onClick={(entry) => handleMonthSliceClick(entry)}
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {yearlyData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={MONTH_COLORS[entry.monthIndex % MONTH_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name) => [`${v}`, `${name}`]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </>
                ) : (
                  <>
                    <Pie
                      data={monthlyStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={80}
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {monthlyStatusData.map((entry, idx) => (
                        <Cell key={`cell-status-${idx}`} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name) => [`${v}`, `${name}`]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </>
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div>
            {selectedMonthIndex !== null ? (
              <Button variant="outlined" size="small" onClick={() => setSelectedMonthIndex(null)}>← Back to Year</Button>
            ) : (
              <Typography variant="body2" color="textSecondary">Yearly distribution — months with no tasks are hidden</Typography>
            )}
          </div>

          <div>
            <Typography variant="body2" className="text-right">
              Total tasks this year: {safeTasks.filter(t => {
                const parsed = getMonthIndexFromDateString(t?.dueDate ?? t?.due ?? "");
                return parsed && parsed.year === currentYear;
              }).length}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
