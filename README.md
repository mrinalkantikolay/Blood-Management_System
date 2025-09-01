# Blood Management System

A full-stack web application for managing blood donations, requests, and hospital operations. This project includes a React frontend and a Node.js/Express backend with a MySQL database.

## Features
- User registration, login, and authentication
- Staff and admin dashboards
- Blood donation and request management
- Hospital and donor management
- Bring Blood Requests and tracking
- Responsive UI with Bootstrap

## Project structure

```
backend/
  server.js           # Express server
  package.json        # Backend dependencies
  config/             # DB configuration
  controllers/        # Route controllers
  middleware/         # Auth and error handlers
  routes/             # API routes
  sql/                # SQL schema and seed files

frontend/
  package.json        # Frontend dependencies
  public/             # Static assets
  src/                # React source
```

## Getting started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MySQL

### Backend setup
1. Navigate to the `backend` folder:
	```sh
	cd backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Configure your MySQL database in `config/db.js` and create a `.env` file (use `backend/.env.example` as a template).
4. Run the SQL scripts in `sql/schema.sql` and `sql/seed.sql` to set up the database.
5. Start the backend server:
	```sh
	npm start
	```

### Frontend setup
1. Navigate to the `frontend` folder:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the frontend development server:
	```sh
	npm start
	```

### Accessing the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Usage
- Register as a user, staff, or admin.
- Donate blood, request blood, and manage requests.
- Staff and admins can manage hospitals, donors, and requests from their dashboards.

## Technologies used
- Frontend: React, React Router, Bootstrap
- Backend: Node.js, Express, MySQL

## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss.

## License
This project is licensed under the MIT License.
