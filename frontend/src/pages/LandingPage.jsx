import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaQuoteLeft,
} from "react-icons/fa";
import FAQSection from "../user/FAQSection";
import "../App.css";

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
    <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69a4.24 4.24 0 001.86-2.34 8.47 8.47 0 01-2.69 1.03 4.22 4.22 0 00-7.3 3.85A12 12 0 013 4.9a4.22 4.22 0 001.3 5.63 4.18 4.18 0 01-1.91-.53v.05a4.22 4.22 0 003.39 4.13 4.23 4.23 0 01-1.9.07 4.22 4.22 0 003.95 2.94A8.47 8.47 0 012 19.54a12 12 0 006.49 1.9c7.79 0 12.06-6.45 12.06-12.04 0-.18-.01-.36-.02-.54A8.6 8.6 0 0024 6.56c-.7.31-1.46.52-2.26.6z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
    <path fill="currentColor" d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
    <path fill="currentColor" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1112 18.5 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zM18 6.3a1 1 0 110 2 1 1 0 010-2z"/>
  </svg>
);

const Mortarboard = () => (
  <svg viewBox="0 0 200 120" className="mortarboard" aria-hidden="true" role="img">
    <polygon points="10,50 100,10 190,50 100,90" fill="#0b3b69"/>
    <polygon points="75,60 125,60 100,72" fill="#0a6fbf"/>
    <line x1="150" y1="50" x2="150" y2="90" stroke="#ffb23f" strokeWidth="4"/>
    <circle cx="150" cy="90" r="6" fill="#ffb23f"/>
  </svg>
);

const LandingPage = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const signupCloseTimer = useRef(null);

  const openSignup = () => {
    if (signupCloseTimer.current) {
      clearTimeout(signupCloseTimer.current);
      signupCloseTimer.current = null;
    }
    setSignupOpen(true);
  };

  const scheduleSignupClose = () => {
    if (signupCloseTimer.current) clearTimeout(signupCloseTimer.current);
    signupCloseTimer.current = setTimeout(() => {
      setSignupOpen(false);
    }, 700);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      id: 1,
      company: "Ethio Telecom",
      logo: "/ethio-telecom-logo.png",
      quote:
        "GLA University's verification system saved us 60% time in employee credential checks.",
    },
    {
      id: 2,
      company: "Commercial Bank of Ethiopia",
      logo: "/cbe-logo.png",
      quote:
        "Highly reliable for document authentication. A game-changer for HR processes.",
    },
    {
      id: 3,
      company: "Awash Bank",
      logo: "/awash-bank-logo.png",
      quote:
        "Integrating this system streamlined our graduate recruitment verification.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 transition-colors duration-300">
      <header className="px-6 mt-2">
        <div className="navbar">
          <div className="brand">GLAU </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Verify</Link>
            <Link to="/login">Live Chat</Link>
          </nav>
          <div className={`dropdown ${signupOpen ? "open" : ""}`} onMouseEnter={openSignup} onMouseLeave={scheduleSignupClose}>
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
            <div className="dropdown-menu" onMouseEnter={openSignup} onMouseLeave={scheduleSignupClose}>
              <Link to="/admin/login" className="dropdown-item" onClick={() => setSignupOpen(false)}>Admin</Link>
              <Link to="/registrar/login" className="dropdown-item" onClick={() => setSignupOpen(false)}>Registrar</Link>
              <Link to="/signup" className="dropdown-item" onClick={() => setSignupOpen(false)}>User</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow px-6 pt-5 max-w-7xl mx-auto w-full">{children}</main>

      
      <section className="px-6 pb-5">
        <div className="hero">
          <section className="hero-left">
            <h1 className="headline">
              <span>GLAD TO</span>
              <span>BE GRAD!</span>
            </h1>
            <p className="subtitle">
              Verify graduate credentials instantly on a secure, modern platform trusted by employers.
            </p>
            <div className="cta-row">
              <Link to="/login" className="btn btn-outline">Read more</Link>
              <div className="socials">
                <button aria-label="Twitter" className="social"><TwitterIcon /></button>
                <button aria-label="Facebook" className="social"><FacebookIcon /></button>
                <button aria-label="Instagram" className="social"><InstagramIcon /></button>
              </div>
            </div>
          </section>

          <section className="hero-art">
            <div className="sun" />
            <div className="leaf leaf-a" />
            <div className="leaf leaf-b" />
            <div className="graduate">
              <div className="head" />
              <div className="shoulder left" />
              <div className="shoulder right" />
            </div>
            <Mortarboard />
          </section>
        </div>
      </section>

      {/* System Description */}
      <section className="py-16 bg-yellow px-6 pb-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How Our System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 - Login/Signup */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">

              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Login/Signup
              </h3>
              <p className="text-gray-600">
                Create an account or login to access the verification system.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Step 2 - Submit Document */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Submit Document
              </h3>
              <p className="text-gray-600">
                Enter the graduate's details to initiate verification.
              </p>
            </div>

            {/* Step 3 - Instant Verification */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Instant Verification
              </h3>
              <p className="text-gray-600">
                Our system cross-checks with GLA University's secure database.
              </p>
            </div>

            {/* Step 4 - Get Results */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Get Results
              </h3>
              <p className="text-gray-600">
                Receive a digitally signed report within seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Who's Happy With Our System
          </h2>
          <div className="relative h-64 overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                    <FaQuoteLeft className="text-blue-600 text-3xl mb-4" />
                    <p className="text-gray-700 text-lg italic">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center mt-6">
                      <img
                        src={testimonial.logo}
                        alt={testimonial.company}
                        className="h-12 mr-4"
                      />
                      <span className="font-bold">
                        {testimonial.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <FAQSection />
      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Map Section - Now at the top */}
          <div
            className="mapouter"
            style={{
              position: "relative",
              textAlign: "right",
              width: "100%",
              height: "450px",
            }}
          >
            <div
              className="gmap_canvas"
              style={{
                overflow: "hidden",
                background: "none!important",
                width: "100%",
                height: "450px",
              }}
            >
              <iframe
                width="100%"
                height="450px"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?q=gla%20university&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
              ></iframe>
            </div>
            <a
              href="https://norsumediagroup.com/embed-google-map-website-free"
              target="_blank"
              rel="noopener noreferrer"
              className="gme-generated-link"
            >
              Embed Map on Website for Free
            </a>
            <style>
              {`.mapouter{position:relative;text-align:right;} .gmap_canvas{overflow:hidden;background:none!important;} .gmap_canvas iframe{width:100%;height:100%;} .mapouter a{display:block;font-size:0.85em;text-align:center;padding:5px 0;color:#6c757d;text-decoration:none;} .gme-generated-link{display:none!important;}`}
            </style>
          </div>

          {/* Content Sections Below Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GLA University</h3>
              <p className="mb-2">GLA University, 17km Stone, NH 2, Mathura Delhi Road, PO Chaumuhan, Mathura, Chhata, Mathura</p>
              <p className="mb-2">Email: glauniversity@gla.ac.in</p>
              <p>Phone: +91 5662-250900</p>
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
                  <Link to="/login" className="hover:text-blue-400">
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
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 justify-start">
                <a
                  href="https://facebook.com/GLAu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://twitter.com/GLAu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://linkedin.com/school/GLA-university"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-300 text-center">
            <p>
              &copy; {new Date().getFullYear()} GLA University. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
