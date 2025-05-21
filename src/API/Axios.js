import axios from "axios";
import Cookie from 'cookie-universal';
const cookie = Cookie();
const token = cookie.get('token');
export const Axios = axios.create({
    headers: {
        Authorization: `Bearer ${token}`
    }
}) 