import React from "react";

const RequestBloodList = ({ requests }) => {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Blood Type</th>
                    <th>Units Needed</th>
                    <th>Hospital</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {requests.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                            No requests found.
                        </td>
                    </tr>
                ) : (
                    requests.map((req) => (
                        <tr key={req.id}>
                            <td>{req.patientName}</td>
                            <td>{req.bloodType}</td>
                            <td>{req.unitsNeeded}</td>
                            <td>{req.hospital}</td>
                            <td>{req.date}</td>
                            <td>{req.status}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default RequestBloodList;