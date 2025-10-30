# 🎓 Web-Based Graduate Document Credentials Verification System

A comprehensive, secure, and user-friendly *web-based graduate document credentials verification system with integrated national ID verification*. This full-stack application is built with a microservice architecture, comprising a main backend API, a React-based frontend, and a dedicated National ID API. It allows external users (employers, institutions) to verify the authenticity of graduate certificates and provides internal university administrators and registrars with secure tools for managing, uploading, and tracking graduate data.

## System Features

This project offers a robust set of features designed for security, reliability, and a seamless user experience across different roles.

---

### 🌗 *Theme Support*

- *Light/Dark Theme:*  
  Users can switch between light and dark modes for a comfortable and personalized experience.

---

### 📝 *User Registration & Authentication*

- *Multi-step Signup:*
  - Begins with National ID (FAN) input and real-time data fetch from the National ID (Fayda) system.
  - Phone number confirmation (must match National ID record).
  - Email and password setup.
  - Email verification with code sent to the user's email.
- *Secure Login:*
  - JWT-based authentication.
  - Rate limiting and lockout after repeated failed attempts.
- *Forgot Password:*
  - Users can request a password reset link/code via email.
  - Secure password reset workflow.

---

### 🆔 *National ID Integration*

- *Fayda (National ID) API Integration:*
  - Real-time validation and retrieval of user identity data.
  - Ensures only legitimate users can register and verify credentials.
  - Phone number cross-check for added security.

---

### 📄 *Graduate Credential Verification*

- *Step-by-step Verification:*
  - Input graduate FAN to fetch and display personal info (read-only).
  - Enter academic details (CGPA, program, program type, graduation year, department).
  - System searches GLA University graduate database.
  - If found, user can view and download their certificate.
  - If not found, user is notified.
- *Automatic Admin Notification:*
  - Every verification attempt (success or failure) is sent to the system admin for review and audit.

---

### 🖼 *Document QR Code*

- *QR Code on Certificates:*
  - Each downloadable certificate includes a unique QR code.
  - Scanning the QR code verifies the authenticity of the document and links back to the system for validation.

---

### 📧 *Email Notifications*

- *Signup Verification:*
  - Verification code sent during registration.
- *Password Reset:*
  - Email with reset instructions.
- *Verification Status:*
  - Users receive notifications about the status of their graduate verification.
- *Admin Alerts:*
  - Admins are notified of all verification attempts and system events.

---

### 🔔 *In-app Notifications*

- *Real-time Notifications:*
  - Users and admins receive instant notifications for important events (verification results, chat messages, etc.).

---

### 💬 *Real-time Chat*

- *Live Chat:*
  - Users can chat directly with system admins for support.
  - Powered by Socket.IO for instant messaging.
- *Typing Indicators & Read Receipts:*
  - Enhanced chat experience with real-time feedback.

---

### 👤 *User Profile Management*

- *Profile Customization:*
  - Users can update their profile photo, email, and password.
  - View non-editable personal information fetched from National ID (Fayda).

---

### 🛡 *Security*

- *Helmet.js:*
  - Sets secure HTTP headers.
- *CORS:*
  - Restricts API access to trusted origins.
- *JWT Authentication:*
  - Secure, stateless user sessions.
- *Rate Limiting:*
  - Prevents brute-force attacks on login and API endpoints.
- *Audit Logging:*
  - All sensitive actions and verification attempts are logged for security and compliance.

---

### 📱 *Responsive Design*

- *Mobile-friendly:*
  - Fully responsive UI for seamless experience on desktop, tablet, and mobile devices.

---

### 🏛 *Role-based Access Control*

- *Admin, Registrar, User Roles:*
  - Different dashboards and permissions for each role.
  - Only authorized users can access sensitive features.

---

### 🗃 *Modular Microservice Architecture*

- *Separation of Concerns:*
  - Main backend, frontend, and national ID API run as independent services for scalability and maintainability.

---

## *Summary Table*

| Feature                   | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| Theme Support             | Light/Dark mode toggle for all users                                        |
| Multi-step Signup         | National ID, phone, email, and email verification                           |
| Forgot Password           | Secure email-based password reset                                           |
| National ID Integration   | Real-time identity validation and phone cross-check                         |
| Graduate Verification     | Step-by-step process, document download, QR code, admin notification        |
| Document QR Code          | Verifiable QR code on each certificate                                      |
| Email Notifications       | Signup, password reset, verification status, admin alerts                   |
| In-app Notifications      | Real-time updates for users and admins                                      |
| Real-time Chat            | Live messaging with admins, typing/read indicators                          |
| Profile Management        | Update photo, email, password; view non-editable ID info                    |
| Security                  | Helmet.js, CORS, JWT, rate limiting, audit logging                          |
| Responsive Design         | Works on all devices                                                        |
| Role-based Access         | Admin, registrar, and user dashboards and permissions                       |
| Microservice Architecture | Scalable, maintainable separation of backend, frontend, and national ID API |

---

*This system is designed for security, reliability, and a seamless user experience, making graduate verification and support fast, trustworthy, and easy to use.*

## *frontend*: React-based ExternalUser/registrar/admin dashboard and chat UI

## *backend*: Express.js REST API for user management, authentication, and chat (with Socket.IO)

## *nationalidapi*: Microservice for national ID verification

---

## Project Structure


FINALPROJECT/
│
├── backend/           # Main backend API (Nodejs, Express, MongoDB, Socket.IO)
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── image/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/          # React frontend (Vite, Tailwindcss, Framer Motion)
│   ├── src/
│   │   ├── admin/
│   │   ├── assets/
│   │   ├── chat/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── registrar/
│   │   └── user/
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── ...
│
├── nationalidapi/     # Microservice for national ID verification
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── idServer.js
│   └── package.json
│
└── .gitignore


---

## Live URLs (Development)

- *Frontend:* [http://localhost:5173](http://localhost:5173)
- *Backend:* [http://localhost:5000](http://localhost:5000)
- *National ID API:* [http://localhost:7000](http://localhost:7000)

---

# 📌 Features

## *Role-based Access* (admin, registrar, user)

---

### *What System Admin Do*

- *Admin Login* with rate limiting and lockout after failed attempts

![image](https://github.com/user-attachments/assets/32eba886-13d3-4b59-956c-0a354411be97)

- *After successful logging in:*, Admin Dashboard in Dark theme

![image](https://github.com/user-attachments/assets/3de278b6-2ddd-4e39-96e5-f0fe3ca761bb)

- - *Upload new Graduates using Exel file* (when admin uploading bulk file simply using .xlxs, .xls, .cvs file)

![image](https://github.com/user-attachments/assets/7dd4cf85-b680-40f2-bae1-86578422a8dc)

- *Real-time Chat* (Socket.IO) between users and admins in Light theme

![image](https://github.com/user-attachments/assets/e75dc48f-daac-4c2d-b5aa-35760e68ae11)

- *User Management* (CRUD, search, edit, delete, photo upload)
- *National ID Verification* using graduate national id FAN (Fayda Alias Number), it must be 16 digit,

![image](https://github.com/user-attachments/assets/d6d6f43a-4091-4ee2-94fb-503ce98a4dba)

---

### *What External User Must Have Do*

## Signup

## External User Signup & Verification Process

This system uses a *multi-step signup process* to ensure user authenticity by integrating with the National ID (Fayda) system.

---

### *Step 1: Enter National ID Number (FAN)*

- The user starts the signup process by entering their *Fayda Alias Number (FAN)* (National ID number).
- The system sends a request to the *nationalidapi* microservice to fetch personal information.
- If the FAN is valid, the following details are displayed (read-only):
  - First Name
  - Middle Name
  - Last Name
  - Gender

![image](https://github.com/user-attachments/assets/498b6a56-b4f9-4649-9503-8156e2761b34)

### *After Clicking "Verify National Id" button*

![image](https://github.com/user-attachments/assets/3fcec445-2a0e-41f4-b7a2-4dc5042ff828)

---

### *Step 2: Phone Number Confirmation*

- The user is prompted to enter their *phone number*.
- The system checks if the entered phone number matches the one registered with the National ID (Fayda) information.
- If the phone number matches, the user proceeds to the next step.
- If not, an error message is shown and the user must try again.

![image](https://github.com/user-attachments/assets/74e9597d-b03f-40ed-be0d-91c09bd0e10e)

---

### *Step 3: Signup with Email & Password*

- The user provides:
  - *Email address*
  - *Password*
- The system creates a new user account in a pending state.

![image](https://github.com/user-attachments/assets/d4241b2f-5c6f-4074-8d06-a0a746cedd82)

---

### *Step 4: Email Verification*

- The system sends a *verification code* to the provided email address.
- The user enters the verification code in the signup form.
- If the code is correct, the account is activated and the user is redirected to their dashboard.
- If the code is incorrect, the user is prompted to try again

![image](https://github.com/user-attachments/assets/8011e6b9-a209-454a-8f44-c9220210a080)

---

### *Step 5: Access Dashboard*

- Upon successful verification, the user is logged in and navigated to their personal dashboard.

![image](https://github.com/user-attachments/assets/3aa70988-4cc4-493f-87a8-d7f79bc579c0)

---

*Summary Table*

| Step | Action                   | System Response                         |
| ---- | ------------------------ | --------------------------------------- |
| 1    | Enter FAN                | Display personal info (read-only)       |
| 2    | Enter phone number       | Check match with National ID info       |
| 3    | Provide email & password | Create account, send verification email |
| 4    | Enter verification code  | Activate account, redirect to dashboard |
| 5    | Access dashboard         | User can use system features            |

---

*Security Notes:*

- All steps are validated server-side.
- National ID and phone number must match official records.
- Email verification is required for account activation.
- *Responsive UI* with Tailwind CSS and Framer Motion
- *Security*: Helmet.js, CORS, JWT authentication, express-rate-limit

## External User Dashboard Features

After successful signup and login, an external user can:

1. *Customize Account*

   - Update profile photo, email, and password.
   - View non-editable personal information fetched from the National ID (Fayda) system.

2. *Live Chat with System Admin*

   - Access real-time chat to communicate directly with system administrators for support or inquiries.

3. *Graduate Credential Verification*
   - *Step 1:* Enter Graduate National ID Number (FAN)
     - The user inputs their FAN.
     - The system fetches and displays personal information (read-only) from the National ID system.

![image](https://github.com/user-attachments/assets/7c40072e-f35d-4099-96a8-db212d096f1a)

- *Step 2:* Enter Academic Information
  - The user provides:
    - CGPA
    - Program
    - Program Type
    - Graduation Year
    - Department

![image](https://github.com/user-attachments/assets/50a93cfe-b3e4-4233-8db6-9ff3efe1dd2b)

- *Step 3:* Search Graduate Record
  - The system checks the GLA University graduate database for a matching record.
  - *If graduate exists:*
    - The user sees a link to view the full document information.
    - The user can open the link and download their graduation certificate

![image](https://github.com/user-attachments/assets/ff371f06-d226-4585-b4e9-ae3510341bcb)

*Downloadable document*
![image](https://github.com/user-attachments/assets/5c257d35-7b0f-4097-82a4-f911fe20ed03)

     - *If graduate does not exist:*
       - The system notifies the user that no matching record was found.

- *Step 4:* Admin Notification
  - Regardless of the result (verified or failed), the graduate's National ID information and verification status are automatically sent to the system admin.
  - The admin receives a message indicating whether the verification was successful or failed.

![image](https://github.com/user-attachments/assets/fc0de182-4961-441b-93d1-764c9164cae6)

*When i click in one notification*

![image](https://github.com/user-attachments/assets/5593f0af-8916-4e10-84aa-24e777c0d559)

---

*Summary Table*

| Feature                    | Description                                                                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customize Account          | Update profile photo, email, password; view personal info                                                                                          |
| Live Chat                  | Real-time messaging with system admin                                                                                                              |
| Graduate Credential Verify | Multi-step process: FAN input → Academic info → Search → Download certificate or get notified if not found; admin is always notified of the result |

---

*Security & Audit:*

- All verification attempts are logged.
- Only verified users can access graduate verification and chat features.
- Admins are notified of every verification attempt and its outcome.

---

## Tech Stack

- *Frontend:* React (Vite), Tailwind CSS, Material UI, Auth0, Socket.IO Client, Chart.js, PDFKit, QRCode.React, SweetAlert2, Framer Motion
- *Backend:* Node.js, Express, MongoDB (Mongoose), Prisma (SQLite for specific features), Socket.IO, JWT, Bcrypt, Multer, Nodemailer, Twilio, PDFKit, XLSX
- *National ID API:* Node.js, Express, MongoDB (Mongoose)
- *Database:* MongoDB, SQLite
- *Security:* Helmet.js, Express Rate Limit, CORS, JWT

---

## Environment Variables

### Frontend (frontend/.env)

env
VITE_ADMIN_ROUTE=http://localhost:5000/api/admin
VITE_NATIONAL_ID_ROUTE=http://localhost:7001/api/national-ids
VITE_AUTH_ROUTE=http://localhost:5000/api/auth
VITE_CHAT_ROUTE=http://localhost:5000/api/chat
VITE_UPLOAD_ROUTE=http://localhost:5000/api/upload
VITE_CERTIFICATE_ROUTE=http://localhost:5000/api/certificate
VITE_REGISTRAR_ROUTE=http://localhost:5000/api/registrar


### Backend (backend/.env)

env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
DATABASE_URL="file:./dev.db" # For Prisma with SQLite

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

ADMIN_EMAIL=your_admin_email@example.com

EMAIL_SERVICE=Gmail
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password # Or other email service credentials

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

CLIENT_URL=http://localhost:5173


### National ID API (nationalidapi/.env)

env
PORT=7001
MONGODB_NATIONAL_ID_URI=your_mongodb_national_id_connection_string
CLIENT_URL=http://localhost:5173


---

## Setup & Installation

### Frontend

sh
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173


### Backend

sh
cd backend
npm install
npm run dev
# Runs on http://localhost:5000


### National ID API

sh
cd nationalidapi
npm install
npm run dev
# Runs on http://localhost:7001


---

## Security

- *Helmet.js*: Sets HTTP headers for security.
- *CORS*: Only allows requests from whitelisted origins.
- *JWT*: Used for authentication and authorization.
- *express-rate-limit*: Protects against brute-force attacks.
- *Rate Limiting*:
  - Global: 100 requests per 15 minutes per IP.
  - Admin Login: 5 attempts per minute per IP. After 5 failed attempts, login is locked for 1 minute.

---

## Troubleshooting

- *CORS errors:* Ensure backend CORS middleware is at the top and origins are correct.
- *MongoDB connection issues:* Check your MONGO_URI in .env.
- *Rate limit lockout:* Wait for 1 minute after 5 failed login attempts.
- *Socket.IO issues:* Make sure the frontend and backend use the same allowed origins and credentials.

> For questions, feedback, or collaboration opportunities,  
> please feel free to reach out via email.
