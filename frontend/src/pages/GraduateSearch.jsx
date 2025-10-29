import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FAQSection from "../user/FAQSection";
const departments = [
  "Mechanical engineering",
  "Civil Engineering",
  "Electrical and Computer Engineering",
  "Computer Science",
  "Biology",
  "Chemistry",
  "Mathematics",
  "Physics",
  "Sport Science",
  "Geology",
  "Statistics",
  "Animal Science",
  "Agricultural Economics",
  "Natural Resources Management",
  "Soil Resource and Watershed Management",
  "Horticulture ",
  "General Forestry",
  "Veterinary Medicine  ",
  "Coffee science and Technology",
  " Accounting and Finance",
  "Banking and Finance",
  "Business and Economics",
  "Economics",
  "Marketing Management ",
  "Management",
  "Public Administration Management",
  "Hotel and Tourism Management",
  "Public Health Department",
  "Pharmacy Department",
  "Nursing Department",
  "Midwifery Department",
  "English Language and Literature Department",
  "Geography and Environmental Studies Department",
  "History and Heritage Management Department",
  "Special Needs and Inclusive Education Department",
  "Sociology Department",
  "Psychology Department",
  "Law",
  "Curriculum and Instruction Department",
  "Social Anthropology Department",
  "Political Science and International Relations Department",
];

const authurl = import.meta.env.VITE_AUTH_ROUTE;
const authURL = import.meta.env.VITE_ADMIN_ROUTE;
const nationalidurl =
  import.meta.env.VITE_NATIONAL_ID_ROUTE ||
  "http://localhost:7001/api/national-ids";

const GraduateSearch = () => {
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    cgpa: "",
    department: "",
    gender: "",
    endDate: "",
    programType: "",
    program: "",
  });

  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
  });
  const [academicDetails, setAcademicDetails] = useState({
    cgpa: "",
    department: "",
    endDate: "",
    programType: "",
    program: "",
  });

  // Fetch personal details based on national ID
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      if (nationalId.length >= 10) {
        // Basic validation for national ID length
        setIsFetching(true);
        setError("");
        try {
          // Replace with your actual National ID API endpoint
          const { data } = await axios.get(`${nationalidurl}/${nationalId}`);

          if (data.success && data.nationalID) {
            setPersonalDetails({
              firstName: data.nationalID.firstName || "",
              middleName: data.nationalID.middleName || "",
              lastName: data.nationalID.lastName || "",
              gender: data.nationalID.gender || "",
            });
          } else {
            setError("National API not found or invalid");
          }
        } catch (err) {
          if (err.response?.status === 404) {
            setError(
              err.response?.data?.error ||
                "No record found with this national ID"
            );
          } else {
            setError(
              "National ID service unavailable. Please contact system admin through our chat."
            );
          }
        } finally {
          setIsFetching(false);
        }
      } else if (nationalId.length > 0 && nationalId.length !== 16) {
        setError("National ID must be 16 digits");
      }
    };

    const debounceTimer = setTimeout(fetchPersonalDetails, 500);
    return () => clearTimeout(debounceTimer);
  }, [nationalId]);

  const handleAcademicChange = (e) => {
    setAcademicDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNationalIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setNationalId(value);
    if (value.length !== 16) {
      setError(value.length > 0 ? "National ID must be 16 digits" : "");
    } else {
      setError("");
    }
  };

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setCertificate(null);
    setIsSearching(true);

    try {
      const searchParams = {
        ...personalDetails,
        ...academicDetails,
      };
      console.log("Search Params:", searchParams);
      const { data } = await axios.get(
        `${import.meta.env.VITE_CERTIFICATE_ROUTE}/name`,
        {
          params: searchParams,
        }
      );
      console.log("Search Result:", data);

      setCertificate(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpen = async () => {
    console.log("Certificate object before navigation:", certificate);
    if (certificate) {
      console.log("Certificate ID:", certificate.certificateID);

      await navigate(`/externalUser/certificate/${certificate.certificateID}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
            Graduate Verification Portal
          </h2>
          <p className="text-center text-blue-100 mt-1">
            Verify academic credentials issued by GLA University
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* National ID Search Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="nationalId"
                className="block text-lg font-semibold text-gray-800 dark:text-gray-200"
              >
                Search by National ID (FAN)
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Required (16 digits)
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                id="nationalId"
                name="nationalId"
                placeholder="Enter 16-digit National ID"
                value={nationalId}
                onChange={handleNationalIdChange}
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                maxLength={16}
              />

              {/* Improved Spinner Implementation */}
              {isFetching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            {error && nationalId.length !== 16 && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Personal Details Section */}
          {personalDetails.firstName && (
            <div className="mb-8 p-5 bg-blue-50 dark:bg-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "First Name", value: personalDetails.firstName },
                  { label: "Middle Name", value: personalDetails.middleName },
                  { label: "Last Name", value: personalDetails.lastName },
                  { label: "Gender", value: personalDetails.gender },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {field.label}
                    </label>
                    <div className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 text-gray-800 dark:text-gray-100">
                      {field.value || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Search Form */}
          {personalDetails.firstName && (
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-5 border border-blue-100 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Academic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      CGPA
                    </label>
                    <input
                      type="number"
                      name="cgpa"
                      value={academicDetails.cgpa}
                      onChange={handleAcademicChange}
                      min="2.00"
                      max="4.00"
                      step="0.01"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={academicDetails.department}
                      onChange={handleAcademicChange}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments
                        .sort((a, b) => a.localeCompare(b))
                        .map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Program
                    </label>
                    <select
                      name="program"
                      value={academicDetails.program}
                      onChange={handleAcademicChange}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Program</option>
                      <option value="BSc">Bachelor's Degree (BSc)</option>
                      <option value="MSc">Master's Degree (MSc)</option>
                      <option value="PhD">Doctorate (PhD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Program Type
                    </label>
                    <select
                      name="programType"
                      value={academicDetails.programType}
                      onChange={handleAcademicChange}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Program Type</option>
                      <option value="regular">Regular</option>
                      <option value="weekend">Weekend</option>
                      <option value="summer">Summer</option>
                      <option value="distance">Distance</option>
                      <option value="night">Night</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Graduation Year
                    </label>
                    <select
                      name="endDate"
                      value={academicDetails.endDate}
                      onChange={handleAcademicChange}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Year</option>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() - 5 + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!personalDetails.firstName || isSearching}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all ${
                  isSearching ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } flex justify-center items-center`}
              >
                {isSearching ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching Records...
                  </>
                ) : (
                  "Search Academic Records"
                )}
              </button>
            </form>
          )}

          {/* Error Message */}
          {error && nationalId.length === 16 && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Certificate Found Section */}
          {certificate && (
            <div className="mt-8 p-5 bg-green-50 dark:bg-gray-700 rounded-xl border border-green-200 dark:border-gray-600">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Certificate Verified
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Graduate Name
                  </p>
                  <p className="font-medium">
                    {certificate.firstName} {certificate.middleName}{" "}
                    {certificate.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Program
                  </p>
                  <p className="font-medium">
                    {certificate.program} in {certificate.department}
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpen}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Full Certificate Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraduateSearch;
