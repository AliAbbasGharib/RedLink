import { useEffect, useState, useMemo } from "react";
import TableShow from "../../../Components/Dashboard/Table"; // Adjust import path if needed
import { AVAILABLEDONOR, USER, USERSTATUS } from "../../../API/Api";
import { Link } from "react-router-dom";
import { Axios } from "../../../API/Axios";
import axios from "axios";
import Cookie from "cookie-universal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchBloodType, setSearchBloodType] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const cookie = Cookie();
    const token = cookie.get("token");

    const header = [
        { name: "Name", key: "name" },
        { name: "PhoneNumber", key: "phone_number" },
        { name: "Blood Type", key: "blood_type" },
        { name: "Address", key: "address" },
        { name: "Role", key: "role" },
        { name: "Status", key: "status" },
    ];



    // Fetch users on page change
    useEffect(() => {
        setLoading(true);
        Axios.get(`${AVAILABLEDONOR}?page=${page}&limit=10`)
            .then((response) => {

                setUsers(response.data.users || []);
                setTotalPages(response.data.totalPages || 1);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [page]);

    // Delete user
    function deleteUser(id) {
        axios
            .delete(`${USER}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setUsers((prev) => prev.filter((el) => el._id !== id));
            })
            .catch((error) => console.log(error));
    }

    // Update user status
    function updateStatus(userId, newStatus) {
        axios
            .put(
                `${USERSTATUS}/${userId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setUsers((prev) =>
                    prev.map((el) => (el._id === userId ? { ...el, status: newStatus } : el))
                );
            })
            .catch((error) => console.log("Failed to update status:", error));
    }

    // Client-side filter on paginated data
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const nameMatch = searchName
                ? user.name?.toLowerCase().includes(searchName.toLowerCase())
                : true;
            const bloodTypeMatch = searchBloodType ? user.blood_type === searchBloodType : true;
            const addressMatch = searchAddress
                ? user.address?.toLowerCase().includes(searchAddress.toLowerCase())
                : true;
            return nameMatch && bloodTypeMatch && addressMatch;
        });
    }, [users, searchName, searchBloodType, searchAddress]);

    return (
        <div className="bg-white w-100 p-2 vh-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h1>Users Page</h1>
                <Link
                    className="btn"
                    style={{ background: "rgb(192, 23, 23)", color: "#fff", padding: "10px", width: "150px" }}
                    to="/dashboard/user/add"
                >
                    Add User
                </Link>
            </div>

            {/* Search Filters */}
            <div className="row mb-3 align-items-end">
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <select
                        className="form-control"
                        value={searchBloodType}
                        onChange={(e) => setSearchBloodType(e.target.value)}
                    >
                        <option value="">All Blood Types</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Address"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                </div>
            </div>

            <TableShow
                header={header}
                data={filteredUsers}
                delete={deleteUser}
                updateStatus={updateStatus}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                fetchPage={setPage} // Pass page setter for pagination
                loading={loading}
            />
        </div>
    );
}
