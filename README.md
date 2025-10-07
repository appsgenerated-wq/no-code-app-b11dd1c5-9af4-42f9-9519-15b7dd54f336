# FoodApp - A Manifest-Powered Recipe Application

This is a complete full-stack recipe sharing application built with React and Manifest. It provides a platform for users to discover, create, and share recipes.

## ✨ Features

- **User Authentication**: Secure user signup, login, and session management.
- **Recipe Management**: Users can create, view, and delete their own recipes.
- **Interactive UI**: A rich interface for creating recipes, including image uploads and selection for categories like difficulty and cuisine.
- **Role-Based Access**: The backend is configured with 'user' and 'admin' roles, with policies restricting certain actions to admins or resource owners.
- **Ownership Policies**: Users can only edit or delete recipes they have created.
- **Manifest Admin Panel**: A pre-built, powerful admin dashboard to manage all data (Users, Recipes, Reviews) is available at `/admin`.

## 🛠️ Tech Stack

- **Backend**: [Manifest](https://www.mnfst.io/) (Handles database, authentication, file storage, and API generation).
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **SDK**: `@mnfst/sdk` for seamless frontend-backend communication.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A running Manifest backend instance.

### Frontend Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Backend URL**:
    Create a `.env.local` file in the root of the project and add your Manifest backend URL:
    ```
    VITE_BACKEND_URL=https://your-manifest-backend-url.com
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

### Default Credentials

- **Admin User**: `admin@manifest.build` / `admin`
- **Demo User**: `user@manifest.build` / `password`
