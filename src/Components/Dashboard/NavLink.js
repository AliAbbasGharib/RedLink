import {
  faTachometerAlt,       // Dashboard
  faUser,                // Donor (single user icon)
  faHandHoldingMedical,  // Available Donor
  faUserPlus,            // Add User
  faTint,                // Request Blood
  faHandHoldingDroplet,  // Add Request (blood drop + hand)
  faEnvelope,            // Message
  faGear,                // Settings
  faRightFromBracket,     // Logout
  faBell
} from '@fortawesome/free-solid-svg-icons';


export const links = [
  {
    name: "Dashboard",
    path: "dashboard",
    icon: faTachometerAlt, // 🧭 Dashboard icon
    role: ["1995", "1996"]
  },
  {
    name: "Donor",
    path: "users",
    icon: faUser, // 👤 Represents a user or donor
    role: ["1995", "1996"]
  },
  {
    name: "Available Donor",
    path: "available-donor",
    icon: faHandHoldingMedical, // 🤲🩺 Great for donor availability
    role: ["1995", "1996"]
  },
  {
    name: "Add Donor",
    path: "/dashboard/user/add",
    icon: faUserPlus, // ➕👤 Add user
    role: ["1995", "1996"]
  },
  {
    name: "Request Blood",
    path: "/dashboard/request",
    icon: faTint, 
    role: ["1995", "1996"]
  },
  {
    name: "Add Request",
    path: "/dashboard/request/add",
    icon: faHandHoldingDroplet,
    role: ["1995", "1996"]
  },
  {
    name: "Notifications",
    path: "/dashboard/notification",
    icon: faBell, 
    role: ["1995", "1996"]
  },
    {
    name: "Messages",
    path: "/dashboard/message",
    icon: faEnvelope, 
    role: ["1995", "1996"]
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: faGear, 
    role: ["1995", "1996"]
  },
  {
    name: "Logout",
    path: "/dashboard", // Consider renaming path to `/logout`
    icon: faRightFromBracket, // 🔚 Logout
    role: ["1995", "1996"]
  }
];
