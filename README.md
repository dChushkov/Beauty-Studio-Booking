# Beauty Studio Booking

Beauty Studio Booking Preview

## 🌟 Live Demo

[Visit the application demo](https://dchushkov.github.io/Beauty-Studio-Booking/)

## 📝 Description

A professional makeup service booking system developed with React, TypeScript, and MongoDB. The application offers an intuitive user interface for clients who want to book makeup services, as well as a powerful administrative panel for managing reservations.

## ✨ Features

- **Appointment Booking** - users can reserve makeup service appointments
- **Real-time Availability Checking** - the system checks if the desired time slot is available
- **Makeup Services** - choice between bridal, evening, and daily makeup
- **Beautiful, Modern UI with Animations** - the user interface is elegant and responsive
- **Multilingual Support** - available in Bulgarian and English
- **Dark/Light Mode** - users can choose their preferred theme
- **Admin Panel** - manage reservations, confirm or cancel appointments
- **Email Confirmation** - notify clients when their reservation is confirmed

## 🛠️ Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- i18next for internationalization
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Zod for validation

## 🚀 Installation and Startup

1. Clone the repository:
   ```bash
   git clone https://github.com/dChushkov/Beauty-Studio-Booking.git
   cd Beauty-Studio-Booking
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

3. Configure MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update the MONGODB_URI in the `.env` file

4. Start the application:
   ```bash
   # In one terminal - Frontend
   npm run dev

   # In another terminal - Backend
   cd server && npm run dev
   ```

5. Open the application in your browser:
   - [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── i18n/          # Internationalization
│   ├── services/      # API services
│   └── context/       # React contexts (theme, language)
├── server/
│   ├── models/        # MongoDB models
│   ├── controllers/   # API controllers
│   ├── routes/        # API routes
│   └── server.js      # Server entry point
```

## 👨‍💻 Author

- [Dimitar Chushkov](https://github.com/dChushkov)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
