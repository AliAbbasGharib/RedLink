import { Route, Routes } from 'react-router-dom';

import Home from './Pages/Website/Home';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import DashBoard from './Pages/DashBoard/DashBoard';
import Users from './Pages/DashBoard/User/Users';
import AddUsers from './Pages/DashBoard/User/AddUsers';
import UpdateUser from './Pages/DashBoard/User/UpdateUsers';
import Err404 from './Pages/Auth/404';
import RequireBack from './Pages/Auth/RequireBack';
import RequireAuth from './Pages/Auth/RequireAuth';
import AddRequestBlood from './Pages/DashBoard/RequestBlood/AddRequestBlood';
import BloodRequests from './Pages/Website/RequestBlood/RequestsBlood';
import UserDetails from './Pages/DashBoard/User/UserDetails';
import GetRequestBlood from './Pages/DashBoard/RequestBlood/GetRequestBlood';
import UserAddRequestBlood from './Pages/Website/RequestBlood/UserAddRequestBlood';
import Contact from './Pages/Website/ContactUS';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/request-blood" element={<BloodRequests />} />
        <Route path="/request-blood/add-request" element={<UserAddRequestBlood />} />
        <Route element={<RequireBack />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/*" element={<Err404 />} />
        <Route element={<RequireAuth allowedRole={['1995', '1996', '1999']} />}>
          <Route path="/dashboard" element={<DashBoard />}>
            <Route element={<RequireAuth allowedRole={['1995']} />}>
              <Route path="users" element={<Users />} />
              <Route path="user/add" element={<AddUsers />} />
              <Route path="users/:id" element={<UpdateUser />} />
              <Route path="users/details/:id" element={<UserDetails />} />
            </Route>
            <Route>
              <Route path="request" element={<GetRequestBlood />} />
              <Route path="request/add" element={<AddRequestBlood />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;