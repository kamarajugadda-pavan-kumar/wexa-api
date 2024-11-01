`src` -> Inside the src folder all the actual source code regarding the project will reside, this will not include any kind of tests. (You might want to make separate tests folder)

Lets take a look inside the `src` folder

- `config` -> In this folder anything and everything regarding any configurations or setup of a library or module will be done. For example: setting up `dotenv` so that we can use the environment variables anywhere in a cleaner fashion, this is done in the `server-config.js`. One more example can be to setup you logging library that can help you to prepare meaningful logs, so configuration for this library should also be done here.

- `routes` -> In the routes folder, we register a route and the corresponding middleware and controllers to it.

- `middlewares` -> they are just going to intercept the incoming requests where we can write our validators, authenticators etc.

- `controllers` -> they are kind of the last middlewares as post them you call you business layer to execute the budiness logic. In controllers we just receive the incoming requests and data and then pass it to the business layer, and once business layer returns an output, we structure the API response in controllers and send the output.

- `repositories` -> this folder contains all the logic using which we interact the DB by writing queries, all the raw queries or ORM queries will go here.

- `services` -> contains the buiness logic and interacts with repositories for data from the database

- `utils` -> contains helper methods, error classes etc.

### Setup the project

- Go inside the folder path and execute the following command:

```
npm install
```

- In the root directory create a `.env` file and add the following env variables
  ```
      PORT=<port number of your choice>
      JWT_SECRET = <generate your jwt secret>
      JWT_EXPIRATION = <1d>
  ```
  ex:
  ```
      PORT = 55000
      JWT_SECRET = xxxxxxxx
      JWT_EXPIRATION = 1d
  ```
- go inside the `src` folder and execute the following command:
  ```
    npx sequelize init
  ```
- By executing the above command you will get migrations and seeders folder along with a config.json inside the config folder.
- If you're setting up your development environment, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, mariadb etc
- If you're setting up test or prod environment, make sure you also replace the host with the hosted db url.

- To run the server execute

```
npm run dev
```

 <!-- Add further details -->

features implemented in this project:

---

# Connectify

**Connectify** is a social networking application that allows users to connect with friends, manage friend requests, and update their profiles. The app features authentication, user management, activity tracking, and a beautiful interface with light/dark theme options. This document outlines the main features of the application, including setup instructions.

## Features

### 1. **Authentication**

- **Login & Registration**: Users can register for a new account and log in securely using email and password.
- **JWT-based Authentication**: Access to protected routes (like the Dashboard and Profile) is restricted to authenticated users using JWT tokens.

### 2. **Dashboard**

- **Activity Feed**: Displays recent user activities, such as friend requests and profile updates, along with the user’s last login time.
- **Friend List**: Shows a list of the user's accepted friends, including their name, email, profile picture, and role.
- **Welcome Message**: Personalizes the dashboard with a warm welcome and last login time.

### 3. **Profile Management**

- **View and Update Profile**: Users can view and update their profile information, including username, email, and profile picture.
- **Edit Profile Mode**: Users can switch between viewing and editing their profile details.
- **Profile Picture Upload**: Users can upload a profile picture, which will display on their profile and friend lists.
- **Theme Preference**: Users can select and save their theme preference (light or dark mode).
- **Bio**: Users can add a short bio to their profile.

### 4. **Friend Requests**

- **Send Friend Requests**: Users can search for other users by name or email and send friend requests.
- **Manage Friend Requests**: Users can accept or reject incoming friend requests.
- **View Sent Requests**: Users can view the list of pending friend requests they’ve sent.

### 5. **Search Functionality**

- **Debounced Search**: The search functionality is optimized with debouncing to minimize network calls, making the app more efficient.

### 6. **Error Handling**

- **404 Page**: A custom "Page Not Found" screen for routes that do not exist.
- **Error Messages**: Displays error messages for invalid login attempts or registration issues.

### 7. **Security**

- **JWT Authentication**: Secures the user data and restricts access to authorized pages.
- **Protected Routes**: Only authenticated users can access pages like Dashboard and Profile.

## API Endpoints

### Authentication

- **POST** `/api/auth/sign-up` - Sign up a new user.
- **POST** `/api/auth/sign-in` - Sign in an existing user.

### User

- **GET** `/api/user/profile` - Get the authenticated user’s profile.
- **PATCH** `/api/user/profile` - Update the authenticated user’s profile (supports file uploads).

### Friends

- **POST** `/api/friend-requests` - Send a new friend request.
- **GET** `/api/friend-requests/received` - View received friend requests.
- **GET** `/api/friend-requests/sent` - View sent friend requests.
- **PUT** `/api/friend-requests/:requestId/accept` - Accept a friend request.
- **PUT** `/api/friend-requests/:requestId/reject` - Reject a friend request.
- **DELETE** `/api/friend-requests/:requestId` - Delete (cancel) a pending friend request.
- **GET** `/api/friends` - View the friends list.
- **GET** `/api/friend-status/:friendId` - Check the friendship status.
- **GET** `/api/friends/search` - Search for users.

### Messages

- **POST** `/api/messages` - Send a message.
- **GET** `/api/messages/conversation/:receiverId` - Get messages between two users.
- **GET** `/api/messages/conversations` - Get all conversations for a user.
- **POST** `/api/messages/read` - Mark messages as read.
- **DELETE** `/api/messages/:messageId` - Delete a message.

### Activity

- **GET** `/api/activity` - Get the authenticated user's activity.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize, MySQL/PostgreSQL
- **Authentication**: JWT
- **File Uploads**: Multer
- **Styling**: Tailwind CSS for modern responsive design

## License

This project is licensed under the MIT License.

---

This `README.md` covers all the essential features implemented in the app, the project setup instructions, and a file structure overview for easy reference.
