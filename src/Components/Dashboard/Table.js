import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    Pagination,
    Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export default function TableShow(props) {
    const [confirmUser, setConfirmUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRow, setMenuRow] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [statusRow, setStatusRow] = useState(null);

    const nav = useNavigate();
    const currentUser = props.currentUser || {};
    const allowedStatuses = ["active", "inactive", "pending", "banned"];
    const rowsPerPage = 10;

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    const handleStatusMenuOpen = (event, row) => {
        setStatusAnchorEl(event.currentTarget);
        setStatusRow(row);
    };
    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
        setStatusRow(null);
    };

    const handlePageChange = (event, value) => {
        if (props.setPage) {
            props.setPage(value);
        }
        if (props.fetchPage) {
            props.fetchPage(value);
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            {props.header.map((el) => (
                                <TableCell key={el.key}>{el.name}</TableCell>
                            ))}
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.loading ? (
                            <TableRow>
                                <TableCell colSpan={props.header.length + 2} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : props.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={props.header.length + 2} align="center">
                                    Users not found...
                                </TableCell>
                            </TableRow>
                        ) : (
                            props.data.map((el, key1) => (
                                <TableRow key={el._id}>
                                    <TableCell>{(props.page - 1) * rowsPerPage + key1 + 1}</TableCell>
                                    {props.header.map((el2, key2) => (
                                        <TableCell key={key2}>
                                            {
                                                el2.key === "status" ? (
                                                    <Chip
                                                        label={
                                                            el[el2.key].charAt(0).toUpperCase() +
                                                            el[el2.key].slice(1)
                                                        }
                                                        color={
                                                            el[el2.key] === "active"
                                                                ? "success"
                                                                : el[el2.key] === "inactive"
                                                                    ? "error"
                                                                    : "default"
                                                        }
                                                        size="small"
                                                    />
                                                ) : el[el2.key] === "1995" ? (
                                                    "Admin"
                                                ) : el[el2.key] === "2001" ? (
                                                    "Donor"
                                                ) : el[el2.key] === "1996" ? (
                                                    "Hospital"
                                                ) : (
                                                    el[el2.key]
                                                )}
                                            {currentUser && el[el2.key] === currentUser.name && " (You)"}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Tooltip title="Actions">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, el)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && menuRow === el}
                                            onClose={handleMenuClose}
                                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                                        >
                                            <MenuItem
                                                component={Link}
                                                to={`/dashboard/users/details/${el._id}`}
                                                onClick={handleMenuClose}
                                            >
                                                <VisibilityIcon sx={{ mr: 1 }} />
                                                Show
                                            </MenuItem>
                                            <MenuItem
                                                onClick={(e) => {
                                                    handleStatusMenuOpen(e, el);
                                                    handleMenuClose();
                                                }}
                                            >
                                                <AutorenewIcon sx={{ mr: 1 }} />
                                                Change Status
                                            </MenuItem>
                                            <MenuItem onClick={() => nav(`/dashboard/users/${el._id}`)}>
                                                <EditIcon sx={{ mr: 1 }} />
                                                Edit
                                            </MenuItem>
                                            {el._id !== currentUser._id && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setConfirmUser(el);
                                                        handleMenuClose();
                                                    }}
                                                    sx={{ color: "error.main" }}
                                                >
                                                    <DeleteIcon sx={{ mr: 1 }} />
                                                    Delete
                                                </MenuItem>
                                            )}
                                        </Menu>
                                        <Menu
                                            anchorEl={statusAnchorEl}
                                            open={Boolean(statusAnchorEl) && statusRow === el}
                                            onClose={handleStatusMenuClose}
                                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                                        >
                                            {allowedStatuses.map((status) => (
                                                <MenuItem
                                                    key={status}
                                                    onClick={() => {
                                                        props.updateStatus(el._id, status);
                                                        handleStatusMenuClose();
                                                    }}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
                <Pagination
                    count={props.totalPages || 1}
                    page={props.page || 1}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Stack>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!confirmUser} onClose={() => setConfirmUser(null)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>{confirmUser?.name}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            props.delete(confirmUser._id);
                            setConfirmUser(null);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Yes
                    </Button>
                    <Button onClick={() => setConfirmUser(null)} variant="outlined">
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
