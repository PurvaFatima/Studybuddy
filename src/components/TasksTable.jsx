"use client";

import * as React from "react";
import {
  Box,Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,Paper,
  IconButton,
  Checkbox,Button,
  TextField,
} from "@mui/material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";


// ------------------------- Pagination Component -------------------------
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

// ------------------------- Main Table Component -------------------------
export default function TasksTable({ tasks, setTasks }) {

   // New Task Input States
  const [task, setTask] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [topic, setTopic] = React.useState("");


  // Sample + User Data
  const [rows, setRows] = React.useState([
    {
      id: 1,
      task: "📌 Example: Math Exam",
      due: "2025-10-01",
      subject: "Algebra",
      completed: false,
      isSample: true,
    },
  ]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);


  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add new task
  const handleAddTask = () => {
    if (!task || !dueDate ) return;

    setTasks([
      ...tasks,
      { task, dueDate, topic, completed: false },
    ])
    setTask("");
    setDueDate("");
    setTopic("")
    setRowsPerPage([...rows, rowsPerPage]);
  };

  // Toggle completed state
  const handleToggleComplete = (id) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, completed: !row.completed } : row
      )
    );
  };

  // Empty rows (for UI consistency)
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ mt: 4 }}>
      {/* ---------- Add New Task Form ---------- */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          size="small"
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Subject"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          size="small"
        />
        <Button variant="contained" color="success" onClick={handleAddTask}>
          Add New Task
        </Button>
      </Box>

      {/* ---------- Table Section ---------- */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  textDecoration: row.completed ? "line-through" : "none",
                  opacity: row.completed ? 0.5 : 1,
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={row.completed}
                    onChange={() => handleToggleComplete(row.id)}
                  />
                </TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.due}</TableCell>
                <TableCell>{row.subject}</TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>

          {/* Pagination */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={rows.length}
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
    </Box>
  );
}
