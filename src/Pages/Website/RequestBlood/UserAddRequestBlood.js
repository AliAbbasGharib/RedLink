import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "cookie-universal";
import RequestBloodForm from "../../DashBoard/RequestBlood/RequestBlood"; // adjust the path
import { ADDREQUESTBLOOD } from "../../../API/Api"; // your API endpoint
import NavBar from "../NavBar";

export default function AddRequestBlood() {
    const nav = useNavigate();
    const cookie = Cookie();
    const token = cookie.get("token");

    const initialData = {
        urgency: '',
        blood_type: '',
        quantity: '',
        request_date: '',
        hospital: '',
        donation_point: '',
        contact_number: '',
        patient_name: '',
        description: '',
        transportation: '',
    };

    const handleSubmit = async (formData) => {
        await axios.post(ADDREQUESTBLOOD, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        }).then((res) => {
            console.log(res.data);
            nav("/request-blood");
        }).catch((error) => {
            console.error("There was an error submitting the request!", error);
            alert("Error submitting request");
            nav("/dashboard/requests");
        });
    }
return (
    <>
        <NavBar />
        <div style={{ marginTop: 100 }} /> {/* Add gap between NavBar and form */}
        <RequestBloodForm
            initialData={initialData}
            onSubmit={handleSubmit}
            title="Request Blood"
            buttonLabel="Submit Request"
        />
    </>
);
}
