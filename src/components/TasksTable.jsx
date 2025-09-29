"use client";

import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead, // header row element
  Paper,
  IconButton,
  Checkbox,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

/*
  TablePaginationActions
  - Small pagination control component used by MUI TablePagination.
  - Props:
    - count: total rows
    - page: current page index (0-based)
    - rowsPerPage: rows per page
    - onPageChange: handler (event, newPage) => void
  - Note: this is intentionally simple — keep logic here minimal and deterministic.
*/
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  // compute last page index once for clarity and to avoid repeating math
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      {/* First page */}
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>

      {/* Previous page */}
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>

      {/* Next page */}
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= lastPage} aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>

      {/* Last page */}
      <IconButton onClick={(e) => onPageChange(e, lastPage)} disabled={page >= lastPage} aria-label="last page">
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

/*
  TasksTable
  - Props:
    - tasks: Array of task objects (expected shape: { id, task, dueDate, subject, completed })
    - setTasks: setter function (usually from parent useState) to update tasks array
  - Responsibility: show a paginated, accessible, and editable list of tasks with add/delete toggle complete features.
*/
export default function TasksTable({ tasks, setTasks }) {
  // ---------------------
  // Form state (controlled inputs)
  // ---------------------
  // NOTE: renamed to taskName/subject for clarity vs. row.task / row.subject
  const [taskName, setTaskName] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [subject, setSubject] = React.useState("");

  // ---------------------
  // Pagination state
  // ---------------------
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // ---------------------
  // Delete confirmation dialog state
  // ---------------------
  const [openDialog, setOpenDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState(null);

  // Today's date (YYYY-MM-DD) used for date input min validation
  const today = new Date().toISOString().split("T")[0];

  // Defensive: ensure tasks is an array to avoid runtime errors
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // ---------------------
  // Handlers
  // ---------------------

  // Page change handler (MUI TablePagination calls with (event, page))
  const handleChangePage = (_, newPage) => setPage(newPage);

  // Rows-per-page change: parse int, reset to first page (expected UX)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add a new task to parent state
  const handleAddTask = () => {
    // Basic validation: require name and date
    if (!taskName || !dueDate) return;

    // Prevent adding past dates
    if (dueDate < today) {
      alert("Please select today or a future date.");
      return;
    }

    // ID generation: Date.now() is fine for small demos but can collide if called very fast.
    // Consider using crypto.randomUUID() in production for guaranteed uniqueness.
    const newTask = {
      id: Date.now(),
      task: taskName,
      dueDate,
      subject,
      completed: false,
    };

    // Append to parent task array (single source of truth)
    setTasks((prev) => [...prev, newTask]);

    // Reset form inputs
    setTaskName("");
    setDueDate("");
    setSubject("");
  };

  // Toggle completed state for a given id
  const handleToggleComplete = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  // Open delete confirmation dialog for a specific task
  const handleDeleteClick = (taskItem) => {
    setTaskToDelete(taskItem);
    setOpenDialog(true);
  };

  // Confirm deletion - remove from parent state
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    }
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  // Cancel deletion flow
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  // ---------------------
  // Derived values
  // ---------------------
  // Keep table height stable by calculating empty rows on the last page
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - safeTasks.length) : 0;

  // ---------------------
  // Render
  // ---------------------
  return (
    <Box sx={{ mt: 4 }}>
      {/* ---------- Add Task Form ---------- */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Task input */}
        <TextField
          label="Task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          size="small"
          inputProps={{ "aria-label": "task name" }} // small a11y improvement
        />

        {/* Due Date input (no past dates allowed) */}
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today, "aria-label": "due date" }}
        />

        {/* Subject input */}
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          size="small"
          inputProps={{ "aria-label": "subject" }}
        />

        {/* Add Button */}
        <Button
          variant="contained"
          onClick={handleAddTask}
          sx={{
            bgcolor: "#6366f1", // indigo (subtle branding)
            color: "white",
            px: 3,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": { bgcolor: "#4f46e5" },
          }}
          aria-label="add task"
        >
          Add Task
        </Button>
      </Box>

      {/* ---------- Tasks Table ---------- */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)", // subtle elevated card
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 500 }}>
          {/* Header: visually distinct but very subtle (no disco) */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              {/* checkbox column (empty header) */}
              <TableCell padding="checkbox" />
              {/* Using an array + map keeps headers maintainable if we reorder later */}
              {["Task", "Subject", "Due Date", "Actions"].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600, color: "#334155" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body: rows are paginated client-side */}
          <TableBody>
            {(rowsPerPage > 0
              ? safeTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : safeTasks
            ).map((row) => (
              // NOTE: using row.id as key — ensure ids are unique (see creation note above)
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: row.completed ? "#f9fafb" : "white",
                  "&:hover": { backgroundColor: "#faf5ff" },
                  transition: "background 0.2s ease",
                }}
              >
                {/* Checkbox for completion */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!row.completed}
                    onChange={() => handleToggleComplete(row.id)} // small inline lambda, acceptable for small lists
                    sx={{
                      color: "#6366f1",
                      "&.Mui-checked": { color: "#22c55e" },
                    }}
                    inputProps={{ "aria-label": `toggle complete for ${row.task}` }}
                  />
                </TableCell>

                {/* Task text */}
                <TableCell
                  sx={{
                    textDecoration: row.completed ? "line-through" : "none",
                    opacity: row.completed ? 0.6 : 1,
                    fontWeight: 500,
                  }}
                >
                  {row.task}
                </TableCell>

                {/* Subject column */}
                <TableCell sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1e293b" }}>
                  {/* Display fallback when subject missing to avoid empty cells */}
                  {row.subject || "—"}
                </TableCell>

                {/* Due date */}
                <TableCell sx={{ fontSize: "0.875rem", color: "#666" }}>{row.dueDate}</TableCell>

                {/* Actions */}
                <TableCell>
                  {/* Delete action */}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(row)}
                    sx={{ "&:hover": { bgcolor: "#fee2e2" }, borderRadius: 2 }}
                    aria-label={`delete ${row.task}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {/* Maintain table height even when on last page with fewer rows */}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>

          {/* Pagination footer */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={5}
                count={safeTasks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <Dialog open={openDialog} onClose={handleCancelDelete} aria-labelledby="confirm-delete-title">
        <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>

          {/* Dialog shows a small preview of the task being deleted */}
          {taskToDelete && (
            <Box sx={{ mt: 1 }}>
              <strong>{taskToDelete.task}</strong>
              <div style={{ color: "#666" }}>
                Due: {taskToDelete.dueDate}
                {/* subject fallback to avoid showing 'undefined' */}
                {taskToDelete.subject ? ` • ${taskToDelete.subject}` : ""}
              </div>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
