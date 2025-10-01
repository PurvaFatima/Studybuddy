"use client";

import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
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

/* ----------------- Table Pagination Component ----------------- */
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= lastPage} aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, lastPage)} disabled={page >= lastPage} aria-label="last page">
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

/* ----------------- Main Tasks Table ----------------- */
export default function TasksTable({ tasks, setTasks }) {
  // ---------- Form State ----------
  const [taskName, setTaskName] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [subject, setSubject] = React.useState("");

  // ---------- Pagination ----------
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // ---------- Delete Dialog ----------
  const [openDialog, setOpenDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState(null);

  const today = React.useMemo(() => new Date().toISOString().split("T")[0], []);
  const safeTasks = React.useMemo(() => Array.isArray(tasks) ? tasks : [], [tasks]);

  /* ---------- Handlers ---------- */
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddTask = () => {
    if (!taskName || !dueDate) return;
    if (dueDate < today) {
      alert("Please select today or a future date.");
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      task: taskName,
      dueDate,
      subject,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskName("");
    setDueDate("");
    setSubject("");
  };

  const handleToggleComplete = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const handleDeleteClick = (taskItem) => {
    setTaskToDelete(taskItem);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - safeTasks.length) : 0;

  return (
    <Box sx={{ mt: 4 }}>
      {/* ---------- Add Task Form ---------- */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <TextField label="Task" value={taskName} onChange={(e) => setTaskName(e.target.value)} size="small" inputProps={{ "aria-label": "task name" }} />
        <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} inputProps={{ min: today, "aria-label": "due date" }} />
        <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} size="small" inputProps={{ "aria-label": "subject" }} />
        <Button variant="contained" onClick={handleAddTask} sx={{ bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" }, color: "white", px: 3, fontWeight: 600, borderRadius: 2, textTransform: "none" }} aria-label="add task">
          Add Task
        </Button>
      </Paper>

      {/* ---------- Tasks Table ---------- */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #6366f1, #4f46e5)", color: "white" }}>
              <TableCell padding="checkbox" />
              {["Task", "Subject", "Due Date", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: "white" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? safeTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : safeTasks
            ).map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  background: row.completed ? "#f3f4f6" : "white",
                  "&:hover": { background: "#eef2ff" },
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={!!row.completed} onChange={() => handleToggleComplete(row.id)} sx={{ color: "#6366f1", "&.Mui-checked": { color: "#22c55e" } }} inputProps={{ "aria-label": `toggle complete for ${row.task}` }} />
                </TableCell>
                <TableCell sx={{ textDecoration: row.completed ? "line-through" : "none", opacity: row.completed ? 0.6 : 1, fontWeight: 500 }}>{row.task}</TableCell>
                <TableCell sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1e293b" }}>{row.subject || "—"}</TableCell>
                <TableCell sx={{ fontSize: "0.875rem", color: "#666" }}>{row.dueDate}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteClick(row)} sx={{ "&:hover": { bgcolor: "#fee2e2" }, borderRadius: 2 }} aria-label={`delete ${row.task}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && <TableRow style={{ height: 53 * emptyRows }}><TableCell colSpan={5} /></TableRow>}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]} colSpan={5} count={safeTasks.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} ActionsComponent={TablePaginationActions} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <Dialog open={openDialog} onClose={handleCancelDelete} aria-labelledby="confirm-delete-title">
        <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
          {taskToDelete && (
            <Box sx={{ mt: 1 }}>
              <strong>{taskToDelete.task}</strong>
              <div style={{ color: "#666" }}>Due: {taskToDelete.dueDate}{taskToDelete.subject ? ` • ${taskToDelete.subject}` : ""}</div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

TasksTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};
