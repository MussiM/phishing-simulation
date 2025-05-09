# Cymulate

A full-stack application

## Features


## Tech Stack

### Backend
- NestJS
- Jest

### Frontend
- React
- Axios

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MussiM/Cymulate.git
   cd Cymulate
   ```

2. Environment Variables:
   
   Create a `.env` file in the `server` directory based on the `.env.example` file:
   ```
   # Server
   PORT=3001
   ```

3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Front: http://localhost:3000
   - server API: http://localhost:3001

### Running Without Docker

#### server:
```bash
cd server
npm install
npm run start:dev
```

#### Frontend:
```bash
cd front
npm install
npm start
```

## API Endpoints


## Testing

### server Tests

#### Unit Tests

```bash
cd server
npm test
```

To run tests with coverage:

```bash
cd server
npm run test:cov
```
