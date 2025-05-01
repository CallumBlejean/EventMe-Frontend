# EventMe Frontend

This is the frontend for the **EventMe** app.

## Description

The EventMe frontend is a **React-based** interface that allows users to:

- Sign up  
- Log in  
- Browse public events  
- Join or leave events  
- See how popular an event is  

**Admin and staff users** can also create and manage events.  
The app uses **Firebase** for authentication and communicates with a **backend API** to manage event data and user roles.

## Tech Stack

- React  
- Firebase Authentication  
- React Router  
- Axios  
- CSS

## Setup Instructions

1. Clone this repository:

   ```bash
   git clone https://github.com/CallumBlejean/EventMe-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your Firebase config to `.firebaseConfig.js`

4. Run the app:

   ```bash
   npm run dev
   ```

## Available Pages

- Login  
- Signup  
- Forgot Password  
- Home  
- About
- Find Events  
- My Events (Can add to google calendar when you join an event.)
- Create Event (for staff/admin)  
- Event Details  
- Profile (Delete account)
- Admin Control (Change user access and control)

## Notes

- Protected routes require login  
- Admins and staff can create events
- Admins can promote to staff and ban people
