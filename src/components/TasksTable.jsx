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

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";

// ------------------------- Pagination Component -------------------------
// Handles table navigation buttons (First, Previous, Next, Last)
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={(e) =>
          onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

// ------------------------- Main Table Component -------------------------
export default function TasksTable({ tasks, setTasks }) {
  // ---------- Input states for the Add Task form ----------
  const [task, setTask] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [topic, setTopic] = React.useState("");

  // ---------- Pagination states ----------
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // ---------- Delete confirmation dialog state ----------
  const [openDialog, setOpenDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState(null);

  // ---------- Today's date (YYYY-MM-DD) for min restriction ----------
  // Define this inside the component so it's available to the JSX
  const today = new Date().toISOString().split("T")[0];

  // ---------- Safety: ensure tasks is an array (avoid runtime errors) ----------
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // ---------- Pagination handlers ----------
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ---------- Add new task ----------
  const handleAddTask = () => {
    // Basic required fields check
    if (!task || !dueDate) return;

    // Prevent adding a past date via typing
    if (dueDate < today) {
      // You may replace alert with a nicer UI in future
      alert("Please select today or a future date.");
      return;
    }

    const newTask = {
      id: Date.now(), // unique id
      task,
      dueDate,
      topic,
      completed: false,
    };

    // Update parent state (single source of truth)
    setTasks((prev) => [...prev, newTask]);

    // Clear inputs
    setTask("");
    setDueDate("");
    setTopic("");
  };

  // ---------- Toggle task completion ----------
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // ---------- Delete flow: open dialog ----------
  const handleDeleteClick = (taskItem) => {
    setTaskToDelete(taskItem);
    setOpenDialog(true);
  };

  // ---------- Confirm and perform deletion ----------
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    }
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  // ---------- Cancel deletion ----------
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  // ---------- Compute empty rows to keep table height consistent ----------
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - safeTasks.length) : 0;

  return (
    <Box sx={{ mt: 4 }}>
      {/* ---------- Add New Task Form ---------- */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          size="small"
        />

        {/* Due Date with past-date disabled via inputProps.min */}
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }} // disables selecting past dates in the picker
        />

        <TextField
          label="Subject"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          size="small"
        />

        {/* Add button unchanged */}
        <Button variant="contained" color="success" onClick={handleAddTask}>
          Add New Task
        </Button>
      </Box>

      {/* ---------- Table Section ---------- */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>
          <TableBody>
            {/* Use safeTasks (the single source of truth) and paginate */}
            {(rowsPerPage > 0
              ? safeTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : safeTasks
            ).map((row) => (
              <TableRow
                key={row.id} // unique key required by React
                sx={{
                  textDecoration: row.completed ? "line-through" : "none",
                  opacity: row.completed ? 0.5 : 1,
                }}
              >
                {/* Checkbox: toggles completion + strike-through */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!row.completed}
                    onChange={() => handleToggleComplete(row.id)}
                  />
                </TableCell>

                {/* Task info columns (unchanged UI) */}
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.topic}</TableCell>

                {/* New Delete column (trash icon) */}
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {/* Keep table height stable */}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>

          {/* ---------- Pagination ---------- */}
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
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
          {taskToDelete && (
            <Box sx={{ mt: 1 }}>
              {/* Show a small preview of the item being deleted */}
              <strong>{taskToDelete.task}</strong>
              <div style={{ color: "#666" }}>
                Due: {taskToDelete.dueDate} {taskToDelete.topic ? `• ${taskToDelete.topic}` : ""}
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
