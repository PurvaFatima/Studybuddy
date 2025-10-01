"use client";

import React from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, Typography, Button, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/* Pastel indigo gradient palette (index 0 => Jan, 11 => Dec) */
const GRADIENT_COLORS = [
  "#E9E6F7", "#E3E0F5", "#D6D0EF", "#CCC6EB", "#BBB2E3", "#B0A6DF",
  "#9C95D4", "#8F89C9", "#7B74B5", "#6C67A3", "#575285", "#44406A",
];

const STATUS_COLORS = ["#34D399", "#F87171"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Parse a date-like string into { month, year } using dayjs with sensible fallbacks.
 * Returns null if parsing fails.
 */
function getMonthIndexFromDateString(dateStr) {
  if (!dateStr) return null;
  const s = typeof dateStr === "string" ? dateStr.trim() : String(dateStr);

  // Primary: rely on dayjs parsing
  const d1 = dayjs(s);
  if (d1.isValid()) {
    return { month: d1.month(), year: d1.year() };
  }

  // Try common formats explicitly (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY)
  const formats = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD", "DD.MM.YYYY"];
  for (const fmt of formats) {
    const d2 = dayjs(s, fmt);
    if (d2.isValid()) return { month: d2.month(), year: d2.year() };
  }

  // Last-ditch: try numeric split fallback as before
  const parts = s.split(/[-\/\.]/).map(p => p.trim());
  if (parts.length >= 3) {
    const y = Number(parts[0]), m = Number(parts[1]) - 1, day = Number(parts[2]);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(day)) {
      const d = new Date(y, m, day);
      if (!isNaN(d.getTime())) return { month: d.getMonth(), year: d.getFullYear() };
    }
  }

  return null;
}

export default function DrilldownMonthPie({ tasks = [] }) {
  // Defensive: ensure tasks is an array
  const safeTasks = React.useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);

  // --- Count tasks per month (0..11) and collect invalid date values for diagnostics
  const { monthCounts, invalidDates } = React.useMemo(() => {
    const counts = new Array(12).fill(0);
    const invalid = [];
    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? "";
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed) {
          if (dateStr) invalid.push({ id: t?.id ?? null, due: dateStr });
          continue;
        }
        if (parsed.year !== currentYear) continue;
        counts[parsed.month] += 1;
      } catch (err) {
        invalid.push({ id: t?.id ?? null, due: t?.dueDate ?? t?.due ?? "?" });
      }
    }
    return { monthCounts: counts, invalidDates: invalid };
  }, [safeTasks, currentYear]);

  // Build full ordered month dataset (keeps index => color mapping)
  const fullYearData = React.useMemo(() => {
    return monthCounts.map((count, idx) => ({
      monthIndex: idx,
      name: MONTH_NAMES[idx],
      value: count,
      color: GRADIENT_COLORS[idx] || "#cccccc",
    }));
  }, [monthCounts]);

  // Filter months with value > 0 in natural order (Jan->Dec)
  const filteredData = React.useMemo(() => fullYearData.filter(m => m.value > 0), [fullYearData]);

  // Total tasks this year, memoized
  const totalThisYear = React.useMemo(() => monthCounts.reduce((s, v) => s + v, 0), [monthCounts]);

  // Legend payload derived from filteredData
  const legendPayload = React.useMemo(() => {
    if (totalThisYear === 0) return [];
    return filteredData.map((d) => ({
      id: d.monthIndex,
      type: "square",
      value: `${d.name} — ${Math.round((d.value / totalThisYear) * 100)}% (${d.value})`,
      color: d.color,
    }));
  }, [filteredData, totalThisYear]);

  // Monthly breakdown (completed vs incomplete) for selected month
  const monthlyStatusData = React.useMemo(() => {
    if (selectedMonthIndex === null) return [];
    let completed = 0, incomplete = 0;
    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? "";
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed || parsed.year !== currentYear || parsed.month !== selectedMonthIndex) continue;
        t.completed ? completed++ : incomplete++;
      } catch (err) {
        // swallow per-item errors, continue
      }
    }
    return [{ name: "Completed", value: completed }, { name: "Incomplete", value: incomplete }];
  }, [safeTasks, selectedMonthIndex, currentYear]);

  // Sum of selected month totals
  const selectedMonthTotal = React.useMemo(
    () => monthlyStatusData.reduce((s, x) => s + (x?.value || 0), 0),
    [monthlyStatusData]
  );

  // Keep an error message up-to-date for invalid date values
  React.useEffect(() => {
    if (invalidDates.length > 0) {
      setErrorMessage(`${invalidDates.length} task(s) had invalid or missing dates and were ignored in the chart.`);
      // Dev-friendly: log exact invalid items to console (safe for dev builds)
      if (typeof window !== "undefined") {
        // console.debug is less noisy than error
        console.debug("DrilldownMonthPie - invalid dates ->", invalidDates);
      }
    } else {
      setErrorMessage(null);
    }
  }, [invalidDates]);

  // Recharts onClick sometimes passes (data, index) or an event; normalize robustly
  const handleMonthSliceClick = (payloadOrEvent) => {
    // payload might be the slice object, or an event object containing payload
    const monthIndex =
      payloadOrEvent?.payload?.monthIndex ??
      payloadOrEvent?.monthIndex ??
      (Array.isArray(payloadOrEvent) && payloadOrEvent[0]?.payload?.monthIndex) ??
      null;

    if (typeof monthIndex === "number") {
      setSelectedMonthIndex(monthIndex);
    }
  };

  return (
    <Card className="w-full" elevation={0}>
      <CardHeader
        title={
          selectedMonthIndex === null
            ? `📅 Tasks This Year (${currentYear})`
            : `✅ Monthly Breakdown — ${MONTH_NAMES[selectedMonthIndex]}: ${selectedMonthTotal} task${selectedMonthTotal !== 1 ? "s" : ""}`
        }
      />

      <CardContent>
        {errorMessage && (
          <Box className="mb-2">
            <Typography variant="body2" color="error">{errorMessage}</Typography>
            <Typography variant="caption" color="textSecondary">Open console to see invalid date values for debugging.</Typography>
          </Box>
        )}

        {totalThisYear === 0 ? (
          <Typography variant="body2" color="textSecondary">No tasks for {currentYear} to display.</Typography>
        ) : (
          <div className="w-full h-72" role="img" aria-label={`Pie chart showing task distribution for ${currentYear}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {selectedMonthIndex === null ? (
                  <>
                    <Pie
                      data={filteredData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      startAngle={90}
                      endAngle={-270}
                      onClick={(d) => handleMonthSliceClick(d)}
                      labelLine={false}
                      label={() => null}
                      paddingAngle={2}
                    >
                      {filteredData.map((entry) => (
                        <Cell
                          key={`cell-${entry.monthIndex}`}
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={1.2}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => {
                        const percent = totalThisYear ? Math.round((value / totalThisYear) * 100) : 0;
                        return [`${value}`, `${name} — ${percent}%`];
                      }}
                      contentStyle={{
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #ccc",
                        color: "#000",
                        padding: "8px 10px",
                        fontSize: 13,
                      }}
                    />

                    <Legend
                      payload={legendPayload}
                      verticalAlign="bottom"
                      height={48}
                      iconSize={12}
                      wrapperStyle={{ bottom: -6 }}
                      layout="horizontal"
                      align="center"
                    />
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
                      labelLine={false}
                      paddingAngle={6}
                    >
                      {monthlyStatusData.map((entry, idx) => (
                        <Cell key={`cell-status-${idx}`} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} stroke="#fff" strokeWidth={1.2} />
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

        <div className="mt-3 flex items-center justify-between pt-4">
          <div>
            {selectedMonthIndex !== null ? (
              <Button variant="outlined" size="small" onClick={() => setSelectedMonthIndex(null)}>← Back to Year</Button>
            ) : (
              <Typography variant="body2" color="textSecondary">Yearly distribution — months with no tasks are hidden</Typography>
            )}
          </div>

          <div aria-live="polite">
            <Typography variant="body2" className="text-right">
              Total tasks this year: {totalThisYear}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
