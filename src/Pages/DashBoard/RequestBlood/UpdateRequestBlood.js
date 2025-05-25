import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATEREQUESTBLOOD, REQUESTBLOOD } from "../../../API/Api";
import { Axios } from "../../../API/Axios";
import RequestBloodForm from "./RequestBlood";

export default function UpdateRequestBlood() {
    const [initialData, setInitialData] = useState({});
    const nav = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const res = await Axios.get(`${REQUESTBLOOD}/${id}`);
                const data = res.data.request;
                console.log(data.request_date?.slice(0, 10))

                setInitialData({
                    urgency: data.urgency,
                    blood_type: data.blood_type,
                    quantity: data.quantity,
                    request_date: data.request_date?.slice(0, 10),
                    donation_point: data.donation_point,
                    location: data.location,
                    donation_point_lat: data.donation_point_lat,
                    donation_point_lng: data.donation_point_lng,
                    contact_number: data.contact_number,
                    patient_name: data.patient_name,
                    description: data.description,
                    transportation: data.transportation,
                });
            } catch (error) {
                console.error("Failed to load request data", error);
            }
        };
        fetchRequestData();
    }, [id]);

    const UpdateSubmit = async (formData) => {
        try {
            await Axios.put(`${UPDATEREQUESTBLOOD}/${id}`, formData);
            nav("/dashboard/request");
        } catch (error) {
            console.error("There was an error submitting the request!", error);
        }
    };

    return (
        <RequestBloodForm
            initialData={initialData}
            onSubmit={UpdateSubmit}
            title="Update Request Blood"
            buttonLabel="Update Request"
        />
    );
}
