# Phishing Simulation Platform

A comprehensive full-stack application for creating, managing, and analyzing phishing simulation campaigns.

## Overview

This platform consists of three main components:
- **Phishing Management**: Backend API for campaign management and analytics
- **Phishing Simulation**: Email delivery service that handles sending and tracking phishing templates
- **Frontend**: React-based administrative interface

## Features

- JWT-based authentication
- Send phishing emails
- Notify when users click phishing tests and update database
- Display a table of all phishing attempts


## Tech Stack

### Backend
- **Phishing Management**: NestJS, MongoDB, TypeORM, Swagger
- **Phishing Simulation**: NestJS, MongoDBM, Nodemailer, JWT authentication

### Frontend
- React
- Axios for API communication
- Modern UI components

### Infrastructure
- Docker and Docker Compose for containerization
- MongoDB for data storage
- Nginx for serving the frontend

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MussiM/phishing-simulation.git
   cd phishing-simulation
   ```

2. Environment Variables:
   
   Create `.env` files in each directory based on the examples below:

   **Phishing Management (.env):**
   ```
   PORT=3001
   DATABASE_URL=mongodb://mongodb:27017/mongo?authSource=admin
   EMAIL_SERVICE_URL=http://phishing-simulation:3002/phishing/send
   ```

   **Phishing Simulation (.env):**
   ```
   PORT=3002
   DATABASE_URL=mongodb://mongodb:27017/mongo?authSource=admin
   JWT_SECRET=your_jwt_secret
   PHISHING_URL=http://localhost:3002/phishing/landing-page
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   PHISHING_SENDER_EMAIL=sender@example.com
   ```

   **Frontend (.env):**
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

3. Run with Docker Compose:

   Update the existing environment variables in the docker-compose file accordingly

   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:80
   - Phishing Management API: http://localhost:3001
   - API Documentation: http://localhost:3001/api
   - Phishing Simulation API: http://localhost:3002
   - API Documentation: http://localhost:3002/api

### Running Without Docker

#### Phishing Management:
```bash
cd phishing-management
npm install
npm run start:dev
```

#### Phishing Simulation:
```bash
cd phishing-simulation
npm install
npm run start:dev
```

#### Frontend:
```bash
cd front
npm install
npm start
```

## API Documentation

The API is documented using Swagger:
- Phishing Management API: http://localhost:3001/api
- Phishing Simulation API: http://localhost:3002/api


## Security Considerations

- This tool is designed for legitimate security testing only
- Always obtain proper authorization before conducting phishing simulations
- Follow all applicable laws and regulations in your jurisdiction
- Never use actual credentials or sensitive information in templates
