import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  GraduationCap,
  Home,
  FileText,
  ShieldCheck,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import UserChatPage from "./UserChatPage";
import axios from "axios";
import {
  FaFacebook,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTwitter,
} from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingSpinner from "../pages/LoadingSpinner";
import { FiLogOut, FiSettings } from "react-icons/fi";

const authurl = import.meta.env.VITE_AUTH_ROUTE;
const authURL = import.meta.env.VITE_ADMIN_ROUTE;
const URL = import.meta.env.VITE_BACKEND_URL;

const UserLayout = ({ children }) => {
  const [preview, setPreview] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const sidebarRef = useRef();
  const chatRef = useRef();
  const navigate = useNavigate();

  // Theme handling
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle Sidebar"]')
      ) {
        setIsSidebarOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChat(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${authurl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
        setPreview(res.data.photo || "");
      } catch (err) {
        console.error("Error fetching current user:", err);
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Show loading indicator
      const swalInstance = Swal.fire({
        title: "Logging out...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 1. Attempt server logout
      try {
        await axios.get(`${authURL}/logout`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (serverError) {
        console.warn(
          "Server logout failed, proceeding with client-side cleanup:",
          serverError
        );
        // Continue with client-side cleanup even if server logout fails
      }

      // 2. Clear client-side state
      localStorage.removeItem("token");
      sessionStorage.removeItem("tempData"); // Clear any session storage if used
      setCurrentUser(null);

      // 3. Close loading and show success
      await Swal.fire({
        title: "Logged Out",
        html:
          '<div class="flex flex-col items-center">' +
          '<svg class="w-16 h-16 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' +
          "</svg>" +
          '<p class="text-lg">You have been successfully logged out</p>' +
          "</div>",
        showConfirmButton: false,
        timer: 2000,
      });

      // 4. Redirect to login with state clear
      navigate("/login", {
        replace: true,
        state: {
          from: null, // Clear any navigation state
        },
      });

      // 5. Force reload to ensure complete cleanup (optional)
      window.location.reload();
    } catch (error) {
      console.error("Unexpected logout error:", error);

      // Comprehensive client-side cleanup
      localStorage.removeItem("token");
      sessionStorage.clear();
      setCurrentUser(null);

      await Swal.fire({
        title: "Session Ended",
        html:
          '<div class="flex flex-col items-center">' +
          '<svg class="w-16 h-16 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />' +
          "</svg>" +
          '<p class="text-lg">Your session has been cleared</p>' +
          "</div>",
        showConfirmButton: true,
        confirmButtonText: "Back to Login",
      });

      navigate("/login", { replace: true });
    }
  };


  // Sidebar navigation items
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "My Documents", icon: FileText, path: "/documents" },
    { name: "Verification Status", icon: ShieldCheck, path: "/verification" },
    { name: "Academic Records", icon: GraduationCap, path: "/records" },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm">
        {/* Header content remains the same as your improved version */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to="/"
                className="flex items-center space-x-2 group transition-transform hover:scale-[1.02]"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-lg group-hover:from-blue-700 group-hover:to-blue-600 dark:group-hover:from-blue-600 dark:group-hover:to-blue-500 transition-all duration-300 shadow-sm">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  GLAU
                </span>
              </Link>
            </div>

            {/* Right Section - Navigation Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notification Button */}
              <button
                className="p-2 relative rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Chat Button */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Messages"
              >
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative ml-2 group">
                <button
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <img
                      src={
                        preview?.startsWith("blob:") ||
                        preview?.startsWith("http")
                          ? preview
                          : preview
                          ? `${URL}${preview}`
                          : "/default-profile.png"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 group-hover:border-blue-500 transition-all duration-300"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                  </div>
                  <span className="hidden sm:inline-block font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                </button>

                {/* Dropdown Menu - Shows on hover */}
                <div
                  className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                          transform translate-y-1 group-hover:translate-y-0 
                          transition-all duration-200 ease-out"
                  onMouseLeave={(e) => e.currentTarget.parentElement.blur()}
                >
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {currentUser?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/user/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <FiSettings
                        className="mr-3 text-gray-400 dark:text-gray-500"
                        size={16}
                      />
                      Update Profile
                    </Link>
                    <Link
                      to="/user/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <FiSettings
                        className="mr-3 text-gray-400 dark:text-gray-500"
                        size={16}
                      />
                      Account Settings
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex cursor-pointer items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-150"
                    >
                      <FiLogOut className="mr-3" size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            Navigation
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="pt-16 md:ml-64 min-h-screen transition-all duration-200"
        style={{ paddingBottom: "6rem" }} // Space for footer
      >
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Chat Component */}

    {showChat && (
        <div
          ref={chatRef}
          className="fixed bottom-4 right-4 z-50 w-full max-w-2xl h-[70vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border dark:border-gray-700"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
              {/* <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3"> */}
               <MessageSquare className=" text-blue-600 dark:text-gray-100" />
            <h3 className="font-semibold text-lg">GLAU help chat</h3>
          {/* </div> */}
           
            <div className="flex gap-2">
              <button
                onClick={() => setChatMinimized(!chatMinimized)}
                className="p-1 hover:bg-black/10 rounded-md"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 hover:bg-black/10 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 overflow-hidden transition-all duration-300 ${
              chatMinimized ? "h-0" : "h-full"
            }`}
          >
            {currentUser ? (
              <UserChatPage currentUser={currentUser} />
            ) : (
              <p className="text-center text-gray-500">
                Unable to load chat. Please try again later.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GLA University</h3>
            <p className="mb-2">P.O. Box: 334, GLA, Ethiopia</p>
            <p className="mb-2">Email: info@GLAU.edu.et</p>
            <p>Phone: +251 XX XXX XXXX</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-blue-400">
                  Verify Documents
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Find Us</h3>
            <div className="mb-4">
              <a
                href="https://www.google.com/maps/place/GLA+University"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-400"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Google Maps
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/GLAu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} className="hover:text-blue-400" />
              </a>
              <a
                href="https://twitter.com/GLAu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} className="hover:text-blue-400" />
              </a>
              <a
                href="https://linkedin.com/school/GLA-university"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} className="hover:text-blue-400" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} GLA University. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
