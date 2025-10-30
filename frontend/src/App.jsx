import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import GraduateSearch from "./pages/GraduateSearch";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import AddGraduate from "./pages/AddGraduate";
import ViewUpdateGraduates from "./pages/ViewUpdateGraduates";
import ThemeProvider from "./pages/ThemeProvider";
import AdminSidebar from "./pages/AdminSidebar";
import AdminLayout from "./pages/AdminLayout";
import CertificateDetail from "./components/CertificateDetail";
import EditGraduate from "./pages/EditCertificate";
import axios from "axios";
import BulkGraduateUpload from "./pages/BulkGraduateUpload";
import SingleGraduateForm from "./pages/SingleGraduateForm";
import UserSignup from "./pages/UserSignup";

import RegistrarLayout from "./registrar/RegistrarLayout";
import StudentsPage from "./registrar/StudentsPage";
import UserLogin from "./pages/UserLogin";
import ForgotPassword from "./pages/ResetPassword";
import UserLayout from "./user/UserLayout";
import RegistrarLogin from "./registrar/RegistrarLogin";
import { useState } from "react";
import { useEffect } from "react";
import ViewAllGraduate from "./registrar/ViewAllGraguate";
import RegistrarEditGraduate from "./registrar/RegistrarEditGraduate";
import SettingsPage from "./registrar/SettingsPage";
import ProfilePage from "./registrar/ProfilePage";
import UserAddingPage from "./admin/UserAdding";
import RegistrarDashBoard from "./registrar/RegistrarDashBoard";
import RegistrarAddGraduate from "./registrar/RegistrarAddGraduate";
import UserManagementPage from "./admin/UserManagementPage";
import ExternalUserManagement from "./admin/ExternalUserManagement";

import UserProfilePage from "./user/UserProfile";

import RequireGuest from "./pages/RequireGuest";
import UserAccountSetting from "./user/UserAccountSetting";

axios.defaults.withCredentials = true;

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem("token");
    if (token) {
      setCurrentUser(token ? token : null); // Or decode token if you want user info
    }
  }, []);
  // const navigate = useNavigate();

  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route
          path="/about"
          element={
            <LandingPage>
              <AboutPage />
            </LandingPage>
          }
        />
        <Route
          path="/login"
          element={
            <RequireGuest currentUser={currentUser}>
              <LandingPage>
                <UserLogin />
              </LandingPage>
            </RequireGuest>
          }
        />
        {/* Internal user routes */}
        <Route
          path="/signup"
          element={
            <RequireGuest currentUser={currentUser}>
              <LandingPage>
                <UserSignup />
              </LandingPage>
            </RequireGuest>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <LandingPage>
              <ForgotPassword />
            </LandingPage>
          }
        />
        <Route
          path="/registrar/login"
          element={
            <LandingPage>
              <RegistrarLogin />
            </LandingPage>
          }
        />
        {/* Internal user routes */}
        <Route
          path="/admin/login"
          element={
            <LandingPage>
              <AdminLogin />
            </LandingPage>
          }
        />
        <Route
          path="/login"
          element={
            <LandingPage>
              <UserLogin />
            </LandingPage>
          }
        />
        {/* Internal user routes */}
        <Route
          path="/signup"
          element={
            <LandingPage>
              <UserSignup />
            </LandingPage>
          }
        />
        {/* External user routes */}
        <Route
          path="/externalUser"
          element={
            <UserLayout>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome To The GLA University Graduate Verification System!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's an overview of your recent activities and important
                  notifications.
                </p>
                <GraduateSearch />
              </div>
            </UserLayout>
          }
        />
        <Route
          path="/externalUser/certificate/:id"
          element={
            <UserLayout>
              <CertificateDetail />
            </UserLayout>
          }
        />

               <Route
          path="/user/profile"
          element={
            <UserLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  You can modify your Profile picture and Phone number only!
                </h3>
                <UserProfilePage />
                {/* Add your dashboard content here */}
              </div>
            </UserLayout>
          }
        />
               <Route
          path="/user/settings"
          element={
            <UserLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  You can change your password!
                </h3>
                <UserAccountSetting />
                {/* Add your dashboard content here */}
              </div>
            </UserLayout>
          }
        />
        {/* registrar routes */}
        <Route
          path="/registrar"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's an overview of your recent activities and important
                  notifications.
                </p>
              </div>
              {/* Add your dashboard content here */}
              <RegistrarDashBoard />
            </RegistrarLayout>
          }
        />
        ``
        <Route
          path="/registrar/verifyunverified"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's an overview of your recent activities and important
                  notifications.
                </p>
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/viewverified"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's an overview of your recent activities and important
                  notifications.
                </p>
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/viewallcertificates"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <ViewAllGraduate />
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/edit-graduate/:certificateID"
          element={
            <RegistrarLayout>
              <RegistrarEditGraduate />
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/studentRecords"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back!
                </h3>
                <StudentsPage />
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/settings"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  You can modify your account settings here!
                </h3>
                <SettingsPage />
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/profile"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  You can modify your Profile picture and Phone number only!
                </h3>
                <ProfilePage />
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        <Route
          path="/registrar/addgraduate"
          element={
            <RegistrarLayout currentUser={currentUser}>
              <div className="space-y-4">
                <RegistrarAddGraduate />
                {/* Add your dashboard content here */}
              </div>
            </RegistrarLayout>
          }
        />
        {/* admin routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-graduate"
          element={
            <AdminLayout>
              <AddGraduate />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-graduate/single"
          element={
            <AdminLayout>
              <SingleGraduateForm />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-graduate/file"
          element={
            <AdminLayout>
              <BulkGraduateUpload />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/view-graduates"
          element={
            <AdminLayout>
              <ViewUpdateGraduates />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/addingUser"
          element={
            <AdminLayout>
              <UserAddingPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/usermanagement"
          element={
            <AdminLayout>
              <UserManagementPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/ExternalUserManagement"
          element={
            <AdminLayout>
              <ExternalUserManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/edit-graduate/:certificateID"
          element={
            <AdminLayout>
              <EditGraduate />
            </AdminLayout>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
