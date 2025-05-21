import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { USER } from "../../../API/Api";
import LoadingSubmit from "../../../Components/Loading";
import { Axios } from "../../../API/Axios";

export default function UserUpdate() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: "",
        role: '',
        gender: '',
        date_of_birth: '',
        address: '',
        blood_type: '',
        last_donation_date: '',
    });
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

  
    const nav = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        Axios.get(`${USER}/${id}`)
            .then(resp => {
                setUser({
                    name: resp.data.data.name,
                    email: resp.data.data.email,
                    phone_number: resp.data.data.phone_number,
                    role: resp.data.data.role,
                    gender: resp.data.data.gender,
                    date_of_birth: resp.data.data.date_of_birth?.slice(0, 10) || '',
                    address: resp.data.data.address,
                    blood_type: resp.data.data.blood_type,
                    last_donation_date: resp.data.data.last_donation_date?.slice(0, 10) || '',
                });
                setLoading(false);
            })
            .then(() => setDisable(false))
            .catch(() => nav("/dashbaord/users/pages/404", { replace: true }));
    }, [nav, id]);

    async function handleSubmit(e) {
        setLoading(true);
        e.preventDefault();
        try {
            await Axios.put(`${USER}/update/${id}`, user);
            nav('/dashboard/users');
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    }

    function handleUser(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            {loading && <LoadingSubmit />}
            <Form className="bg-white shadow rounded-4 p-4 w-100" style={{ maxWidth: 500 }} onSubmit={handleSubmit}>
                <h2 className="text-center fw-bold mb-4 text-danger">Update User</h2>

                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <Form.Control type="text" name="name" value={user.name} onChange={handleUser} placeholder="Enter Full Name..." />
                    {user.name === "" && error && <p className="mt-2 text-danger small">The name field is required.</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control type="email" name="email" value={user.email} onChange={handleUser} placeholder="Enter Email..." />
                    {user.email === "" && <p className="mt-2 text-danger small">The email field is required.</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                    <Form.Label className="fw-semibold">Phone Number</Form.Label>
                    <Form.Control type="number" name="phone_number" value={user.phone_number} onChange={handleUser} placeholder="Enter Phone Number..." />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Gender</Form.Label>
                    <Form.Select name="gender" value={user.gender} onChange={handleUser}>
                        <option disabled value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                    <Form.Control type="date" name="date_of_birth" value={user.date_of_birth} onChange={handleUser} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Last Donation Date</Form.Label>
                    <Form.Control type="date" name="last_donation_date" value={user.last_donation_date} onChange={handleUser} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Address</Form.Label>
                    <Form.Control type="text" name="address" value={user.address} onChange={handleUser} placeholder="Enter Address..." />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Blood Type</Form.Label>
                    <Form.Select name="blood_type" value={user.blood_type} onChange={handleUser}>
                        <option disabled value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicRole">
                    <Form.Label className="fw-semibold">Role</Form.Label>
                    <Form.Select name="role" value={user.role} onChange={handleUser} required>
                        <option value="">Select Role</option>
                        <option value={1995}>Admin</option>
                        <option value={1996}>Hospital</option>
                        <option value={1999}>Patient</option>
                        <option value={2001}>Doner</option>
                    </Form.Select>
                    {user.role === "" && <p className="mt-2 text-danger small">The role field is required.</p>}
                </Form.Group>

                <Button
                    disabled={disable}
                    variant="danger"
                    className="w-100 fw-bold py-2 mt-2"
                    type="submit"
                >
                    Save
                </Button>
            </Form>
        </div>
    );
}