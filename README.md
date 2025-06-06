# 🚀 Node.js + Express + MongoDB Full Stack Project

This guide will help you set up and run a Node.js + Express + MongoDB project on your local machine.

---

## 📦 Requirements

- Node.js (Recommended: v16.14.0)
- MongoDB (Recommended: v4.4)
- Git

---

## 🟢 1. Install Node.js

### Option 1: Using APT (Ubuntu)
```bash
sudo apt update
sudo apt install nodejs npm
```

### Option 2: Using NVM (Recommended)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install 16.14.0
nvm use 16.14.0
```
🔗 More info on installing Node.js via NVM

---

## 🍃 2. Install MongoDB

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
# Add the MongoDB source list (refer to the tutorial below)
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```
🔗 MongoDB setup guide

---

## 📁 3. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```
Replace `<your-repo-url>` with your actual Git repository URL.

---

## ⚙️ 4. Configure Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
NODE_ENV=<development>
DB_NAME=<Your_Database_Name>
MONGO_CNNSTR=mongodb://<username>:<password>@localhost:27017/<Your_Database_Name>
PORT=4000
SECRET_KEY=uV0lLbUzAoAvXpZjiiyxaxmtKY9sYDAN
```

- Replace `<Your_Database_Name>` with your MongoDB database name.
- Replace `<username>` and `<password>` with your MongoDB credentials.
- You can generate a new `SECRET_KEY` using any random string generator.

---

## 📦 5. Install Project Dependencies

Make sure you're in the project root directory:

```bash
npm install
```

---

## ▶️ 6. Run the Project

To start your application:

```bash
npm start
```

Your server will be running on: http://localhost:4000

---

## 🛠 Folder Structure (Basic Example)

```
project-root/
│
├── controllers/        # Controller files for handling business logic
├── services/           # Service for database
├── models/             # Mongoose schemas and models
├── routes/             # Express routes
├── middlewares/        # Custom middleware functions
├── config/             # Configuration files (DB connection, etc.)
├── .env                # Environment variables
├── package.json
├── server.js / app.js  # Entry point of the application
└── README.md
```

---

## ❓ Troubleshooting

- Make sure MongoDB service is running:
  ```bash
  sudo systemctl status mongod
  ```
- Check for port conflicts (default is 4000).
- Review `.env` values carefully for typos or invalid credentials.