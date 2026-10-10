
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import ProfileDetails from "./pages/ProfileDetails";
import Interests from "./pages/Interests";
import Matches from "./pages/Matches";
import PartnerPreferences from "./pages/PartnerPreferences";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminReports from "./pages/AdminReports";
import MyReports from "./pages/MyReports";
import Membership from "./pages/Membership";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profiles/:id" element={<ProfileDetails />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/partner-preferences" element={<PartnerPreferences />} />
        <Route path="/chat/:matchId" element={<Chat />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/membership" element={<Membership />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
