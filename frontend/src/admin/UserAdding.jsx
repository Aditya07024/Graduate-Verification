import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const authurl = import.meta.env.VITE_ADMIN_ROUTE;
const nationalidurl = import.meta.env.VITE_NATIONAL_ID_ROUTE;
const userAuthUrl = import.meta.env.VITE_AUTH_ROUTE;
const UserAddingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    nationalIdNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    role: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const nationalidurl = import.meta.env.VITE_NATIONAL_ID_ROUTE;
  // const authurl = import.meta.env.VITE_AUTH_ROUTE;

  useEffect(() => {
    if (
      formData.nationalIdNumber.length > 0 &&
      formData.nationalIdNumber.length !== 16
    ) {
      setError("National ID must be 16 digits");
    } else {
      setError("");
    }
  }, [formData.nationalIdNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerifyNationalId = async () => {
    if (formData.nationalIdNumber.length !== 16) {
      setError("Please enter a valid 16-digit National ID");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${nationalidurl}/${formData.nationalIdNumber}`
      );

      if (data.success && data.nationalID) {
        setFormData((prev) => ({
          ...prev,
          firstName: data.nationalID.firstName,
          middleName: data.nationalID.middleName,
          lastName: data.nationalID.lastName,
          gender: data.nationalID.gender,
        }));

        setStep(2);
        setError("");
      } else {
        setError(data.error || "National ID not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify National ID");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (!formData.phone) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${nationalidurl}/nationalIdNumber`, {
        params: {
          nationalIdNumber: formData.nationalIdNumber,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });

      if (data.success) {
        setStep(3);
        setError("");
      } else {
        setError(data.error || "Identity verification failed");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          "Access denied. Please check your permissions or login again."
        );
        // Optionally redirect to login
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Verification error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.post(
        `${authurl}/createUser`,
        {
          nationalIdNumber: formData.nationalIdNumber,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          gender: formData.gender,
          phone: formData.phone,
          role: formData.role,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setError("");
        Swal.fire({
          icon: "success",
          title: "User created successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => setStep(1), 1500);

        setFormData({
          nationalIdNumber: "",
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          phone: "",
          email: "",
          password: "",
          role: "user",
          confirmPassword: "",
        });
      } else {
        setError(data?.error || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 overflow-x-hidden">
      <div className="w-full max-w-full md:max-w-7xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
          User Registration
        </h2>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
      ${
        step >= stepNumber
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      }`}
              >
                {stepNumber}
              </div>
              <div
                className={`text-xs mt-1 ${
                  step >= stepNumber
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500"
                }`}
              >
                {["Verify ID", "Confirm", "Account"][stepNumber - 1]}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: National ID Verification */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                National ID Number
              </label>
              <input
                type="text"
                name="nationalIdNumber"
                placeholder="Enter 16-digit National ID"
                value={formData.nationalIdNumber}
                onChange={handleInputChange}
                maxLength={16}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleVerifyNationalId}
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Verify National ID"}
            </button>
          </div>
        )}

        {/* Step 2: Confirm Identity */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  value={formData.gender}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleVerifyIdentity}
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </div>
        )}

        {/* Step 3: Create Account */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create password (min 8 chars)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.password.length > 0 && formData.password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="registrar">Registrar</option>
                <option value="user">External User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAddingPage;
