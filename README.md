# URoute

A brief description of your project goes here.  
_Example:_  
This project is an in-building navigation and resource management app that supports booking, events, attendances, and more.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Environment Configuration](#environment-configuration)
  - [Installing Dependencies](#installing-dependencies)
  - [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Additional Notes](#additional-notes)

---

## Setup Instructions

### 1. Environment Configuration

#### Copy .env.example to .env in the `/server` Folder

Open a terminal, navigate to the `/server` folder, and run:

```
cp .env.example .env
```

#### Configure the .env File

PORT:
Change the value to whatever port you prefer (e.g., 8080 is recommended). This is the port where the server will listen. For example, if the port is set to 8080, your fetch requests will be made to http://localhost:8080.

ACCESS_TOKEN_SECRET & ACCESS_REFRESH_SECRET:
Navigate to the /server/scripts/ folder from the terminal:

```
cd server/scripts
```

Then run:

```
node generate-secret.js
```

This will generate keys for both secrets. Copy the generated keys and paste them into your .env file in the corresponding fields.

CLIENT_ORIGIN:
This variable should be set to the origin from which your client (React app) will make fetch requests. For development, this is typically something like http://localhost:5173.
If you encounter errors in your console regarding the origin (e.g., "The 'Access-Control-Allow-Origin' header has a value ..." error), update this value to match the origin shown in the error.

### 2. Installing Dependencies

#### For both the server and client, navigate into each folder and run npm install:

For the Server:

```
cd server
npm install
```

For the Client:

```
cd client
npm install
```

### 3. Database Configuration

#### Within the /server folder, open and edit the db.js file:

```
host: Set to your database host.
port: Set to the port number for your database.
user: Set to your database username.
password: Set to your database password.
database: Set to the name of the database you want to reference.
```

Note:
Ensure that you have downloaded the db.sql file from: insert_file_path_here (replace this with the actual file path or URL).

## Running the Application

Open Two Terminal Windows:

Terminal 1 (Client):
Navigate to the /client folder and run:

```
npm run dev
```

This will start the React development server.

Terminal 2 (Server):
Navigate to the /server folder and run:

```
npm start
```

This will start your Express server.

Access the App:

With the server running (e.g., on http://localhost:8080) and the client running (e.g., on http://localhost:5173), your client app should be able to fetch data from the server as configured.

## Additional Notes

CORS Configuration:
The server uses CORS middleware configured via environment variables. Ensure that CLIENT_ORIGIN in your .env file matches your client’s URL.

Token Generation:
The /server/scripts/generate-secret.js script is used to generate your JWT secrets. Always keep these secrets secure and do not commit your actual .env file to version control.

Environment Variables:
Make sure your .env file is properly configured. The project includes an .env.example file as a template. Do not forget to copy it to .env and update its values.

Development vs. Production:
Adjust the configuration (such as CORS and secure cookie settings) when moving to production. Use environment variables to manage these differences.
