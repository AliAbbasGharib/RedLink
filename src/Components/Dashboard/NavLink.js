import { faPlus, faUsers, faHome, faMessage,faTint, faServer, faSignOut } from '@fortawesome/free-solid-svg-icons';

export const links = [
    {
        name: "Dashboard",
        path: "users",
        icon: faHome,
        role: "1995"
    },
    {
        name: "User",
        path: "users",
        icon: faUsers,
        role: "1995"

    },
    {
        name: "Add User",
        path: "/dashboard/user/add",
        icon: faPlus,
        role: ["1995", "1996"]

    },
    {
        name: "RequestBlood",
        path: "/dashboard/request",
        icon: faTint,
        role: ["1995", "1996"]

    },
    {
        name: "Add Request",
        path: "/dashboard/request/add",
        icon: faPlus,
        role: ["1995", "1996"]

    },
    {
        name: "Message",
        path: "/dashboard/writer",
        icon: faMessage,
        role: ["1995", "1996"]
    },
    {
        name: "Settings",
        path: "/dashboard/products",
        icon: faServer,
        role: ["1995", "1999"]

    },
    {
        name: "Logout",
        path: "/dashboard/product/add",
        icon: faSignOut,
        role: ["1995"]

    },
]