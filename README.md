EventMe Frontend
This is the frontend for the EventMe app.

Description
The EventMe frontend is a React-based interface that allows users to sign up, log in, browse public events, join or leave events, and view their profile. Admin and staff users can also create and manage events. The app uses Firebase for authentication and communicates with a backend API to manage event data and user roles.

Tech Stack
React

Firebase Authentication

React Router

Axios

CSS

Setup Instructions
Clone this repository:
git clone https://github.com/CallumBlejean/EventMe-Frontend

Install dependencies:
npm install

Add your Firebase config to .firebaseConfig.js

Run the app:
npm run dev

Available Pages
Login

Signup

Forgot Password

Home

Find Events

My Events

Create Event (for staff/admin)

Event Details

Profile

Notes
Protected routes require login

Admins and staff can create events