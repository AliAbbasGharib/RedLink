import { useEffect, useState } from "react";
import Tables from "../../../Components/Dashboard/Table";
import { USER, USERS, USERSTATUS } from "../../../API/Api";
import { Link } from "react-router-dom";
import { Axios } from "../../../API/Axios";
import axios from "axios";
import Cookie from "cookie-universal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [searchBloodType, setSearchBloodType] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const  cookie = Cookie();
    const token = cookie.get("token");
    const header = [
        { name: "Name", key: "name" },
        { name: "PhoneNumber", key: "phone_number" },
        { name: "Blood Type", key: "blood_type" },
        { name: "Address", key: "address" }
    ];

    useEffect(() => {
        Axios.get(USER)
            .then((response) => setCurrentUser(response.data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        Axios.get(USERS)
            .then((response) => {
                setUsers(response.data);
                setFilteredUsers(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

function deleteUser(id) {
    axios.delete(`${USER}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(() => {
            setUsers(prev => prev.filter((el) => el._id !== id));
            setFilteredUsers(prev => prev.filter((el) => el._id !== id)); 
        })
        .catch((error) => console.log(error));
}

   function updateStatus(userId, newStatus) {
    axios.put(`${USERSTATUS}/${userId}`, { status: newStatus }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },  
    })
        .then(() => {
            setUsers(prev =>
                prev.map((el) =>
                    el._id === userId ? { ...el, status: newStatus } : el
                )
            );
            setFilteredUsers(prev =>
                prev.map((el) =>
                    el._id === userId ? { ...el, status: newStatus } : el
                )
            );
        })
        .catch((error) => console.log("Failed to update status:", error));
}
    // Handle filter button click
    function handleFilter() {
        setFilteredUsers(
            users.filter(user => {
                const bloodTypeMatch = searchBloodType ? user.blood_type === searchBloodType : true;
                const addressMatch = searchAddress ? user.address?.toLowerCase().includes(searchAddress.toLowerCase()) : true;
                return bloodTypeMatch && addressMatch;
            })
        );
    }

    // Optional: Reset filter
    function handleReset() {
        setSearchBloodType("");
        setSearchAddress("");
        setFilteredUsers(users);
    }

    return (
        <div className="bg-white w-100 p-2 vh-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h1>Users Page</h1>
                <Link className="btn" style={{
                    background: "rgb(192, 23, 23)",
                    color: "#fff",
                    padding: "10px",
                    width: "150px"
                }} to="/dashboard/user/add">Add User</Link>
            </div>

            {/* Responsive Search Filters */}
            <div className="row mb-3 align-items-end">
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                    <select
                        className="form-control"
                        value={searchBloodType}
                        onChange={e => setSearchBloodType(e.target.value)}
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
                        onChange={e => setSearchAddress(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-2 mb-2 mb-md-0">
                    <button className="btn btn-danger w-100" onClick={handleFilter}>Filter</button>
                </div>
                <div className="col-12 col-md-2">
                    <button className="btn btn-secondary w-100" onClick={handleReset}>Reset</button>
                </div>
            </div>

            <Tables
                header={header}
                data={filteredUsers}
                delete={deleteUser}
                updateStatus={updateStatus}
                currentUser={currentUser}
            />
        </div>
    );
}