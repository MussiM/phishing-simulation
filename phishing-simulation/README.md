# Phishing Simulation Platform

A modern phishing simulation platform built with NestJS that allows security teams to send simulated phishing emails to test employee awareness and provide training opportunities.

## Description

This application provides an API for creating and sending phishing simulation emails to recipients. It tracks email delivery and click events, allowing organizations to measure security awareness and identify areas for user training.

The platform is built using:
- NestJS framework for the backend
- Prisma ORM with MongoDB for data storage
- Swagger for API documentation

## Features

- **Email Phishing**: Send simulated phishing emails
- **Click Tracking**: Record when recipients click on links in phishing emails
- **API Documentation**: Fully documented API with Swagger UI
- **Containerized Deployment**: Docker support for easy deployment

## Setup and Configuration

### Prerequisites

- Node.js 18 or higher
- MongoDB database
- SMTP server for sending emails, you can visit in https://mailtrap.io/

### Installation

```bash
npm install

npm run prisma:generate
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="mongodb://username:password@localhost:27017/phishing-simulation"

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=yourpassword
SMTP_FROM=noreply@example.com

# Application
PORT=3002
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t phishing-simulation .

# Run the container
docker run -p 3002:3002 --env-file .env phishing-simulation
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3002/api
```
