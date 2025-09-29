"use client";

import React from "react";
import { Card, CardContent, CardHeader, Typography, Button, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/* Gradient palette (index 0 => Jan, 11 => Dec) */
const GRADIENT_COLORS = [
  "#E9E6F7", // Jan (light)
  "#E3E0F5", // Feb
  "#D6D0EF", // Mar
  "#CCC6EB", // Apr
  "#BBB2E3", // May
  "#B0A6DF", // Jun
  "#9C95D4", // Jul
  "#8F89C9", // Aug
  "#7B74B5", // Sep
  "#6C67A3", // Oct
  "#575285", // Nov
  "#44406A", // Dec (dark)
];

const STATUS_COLORS = ["#34D399", "#F87171"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMonthIndexFromDateString(dateStr) {
  if (!dateStr) return null;
  const s = typeof dateStr === "string" ? dateStr.trim() : String(dateStr);
  if (!s) return null;
  const t = Date.parse(s);
  if (!isNaN(t)) {
    const d = new Date(t);
    return { month: d.getMonth(), year: d.getFullYear() };
  }
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
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState(null);
  const currentYear = new Date().getFullYear();
  const safeTasks = React.useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const [errorMessage, setErrorMessage] = React.useState(null);

  // --- Count tasks per month (0..11)
  const { monthCounts, invalidDates } = React.useMemo(() => {
    const counts = new Array(12).fill(0);
    const invalid = [];
    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? "";
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed) {
          if (dateStr) invalid.push({ id: t.id, due: dateStr });
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

  // --- Build FULL ordered month array (keeps index => color mapping)
  const fullYearData = React.useMemo(() => {
    return monthCounts.map((count, idx) => ({
      monthIndex: idx,
      name: MONTH_NAMES[idx],
      value: count,
      color: GRADIENT_COLORS[idx] || "#cccccc", // color locked by month index
    }));
  }, [monthCounts]);

  // --- Filter out months with 0 tasks (but keep order Jan -> Dec)
  const filteredData = React.useMemo(() => {
    return fullYearData
      .filter(m => m.value > 0)
      .sort((a, b) => a.monthIndex - b.monthIndex); // ensure natural order
  }, [fullYearData]);

  const totalThisYear = monthCounts.reduce((s, v) => s + v, 0);

  // --- Legend payload created from the SAME filteredData so legend order matches pie order
  const legendPayload = React.useMemo(() => {
    if (totalThisYear === 0) return [];
    return filteredData.map((d) => ({
      id: d.monthIndex,
      type: "square",
      value: `${d.name} — ${Math.round((d.value / totalThisYear) * 100)}% (${d.value})`,
      color: d.color,
    }));
  }, [filteredData, totalThisYear]);

  // --- Monthly drilldown completed/incomplete
  const monthlyStatusData = React.useMemo(() => {
    if (selectedMonthIndex === null) return [];
    let completed = 0, incomplete = 0;
    for (const t of safeTasks) {
      try {
        const dateStr = t?.dueDate ?? t?.due ?? "";
        const parsed = getMonthIndexFromDateString(dateStr);
        if (!parsed || parsed.year !== currentYear || parsed.month !== selectedMonthIndex) continue;
        t.completed ? completed++ : incomplete++;
      } catch (err) {}
    }
    return [{ name: "Completed", value: completed }, { name: "Incomplete", value: incomplete }];
  }, [safeTasks, selectedMonthIndex, currentYear]);

  const selectedMonthTotal = monthlyStatusData.reduce((s, x) => s + (x?.value || 0), 0);

  React.useEffect(() => {
    if (invalidDates.length > 0) {
      setErrorMessage(`${invalidDates.length} task(s) had invalid or missing dates and were ignored in the chart.`);
    } else {
      setErrorMessage(null);
    }
  }, [invalidDates]);

  // Recharts onClick sometimes supplies payload or event; normalize it
  const handleMonthSliceClick = (payload) => {
    const monthIndex = payload?.payload?.monthIndex ?? payload?.monthIndex ?? null;
    if (monthIndex !== null && typeof monthIndex !== "undefined") {
      setSelectedMonthIndex(monthIndex);
    }
  };

  return (
    <Card className="w-full" elevation={0}>
      <CardHeader
        title={
          selectedMonthIndex === null
            ? ` 📅 Tasks This Year  (${currentYear})`
            : `✅ Monthly Breakdown  ${MONTH_NAMES[selectedMonthIndex]} — ${selectedMonthTotal} task${selectedMonthTotal !== 1 ? "s" : ""}`
        }
      />

      <CardContent>
        {errorMessage && (
          <Box className="mb-2">
            <Typography variant="body2" color="error">{errorMessage}</Typography>
            <Typography variant="caption" color="textSecondary">Open console to see the invalid date values.</Typography>
          </Box>
        )}

        {totalThisYear === 0 ? (
          <Typography variant="body2" color="textSecondary">No tasks for {currentYear} to display.</Typography>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {selectedMonthIndex === null ? (
                  <>
                    {/* IMPORTANT: Pass filteredData (months with tasks) — already sorted Jan->Dec */}
                    <Pie
                      data={filteredData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      startAngle={90}    // start at top
                      endAngle={-270}    // go clockwise full circle
                      onClick={(data) => handleMonthSliceClick(data)}
                      labelLine={false}
                      label={() => null} // hide radial labels; legend is authoritative
                      paddingAngle={2}
                    >
                      {filteredData.map((entry) => (
                        <Cell
                          key={`cell-${entry.monthIndex}`}
                          fill={entry.color}      // color locked by monthIndex
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
                        fontSize: 13
                      }}
                    />

                    {/* Explicit legend payload: forces legend order and colors to match filteredData */}
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
                    {/* Drilldown view */}
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
