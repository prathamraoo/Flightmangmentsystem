# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Start the Project

### Option 1: Manual Start (Recommended for Windows)

#### Terminal 1 - Backend
```bash
cd project/backend
npm install
node index.js
```

You should see:
```
Hi !,Iam Backend running on 8000
database connected successfully
```

#### Terminal 2 - Frontend
```bash
cd project
npm install
npm run dev
```

You should see Vite dev server running on `http://localhost:5173`

### Option 2: Using npm scripts

Add these scripts to your `project/package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "backend": "cd backend && node index.js",
    "start:all": "concurrently \"npm run backend\" \"npm run dev\""
  }
}
```

Then install concurrently:
```bash
npm install -D concurrently
```

And run:
```bash
npm run start:all
```

## First Time Setup

### 1. Create Admin User

After starting the backend, create an admin user:

**Method 1: Using MongoDB Compass or Atlas**
1. Connect to your database
2. Find the `users` collection
3. Update any user document:
```javascript
{
  "role": "admin"
}
```

**Method 2: Using createAdmin.js script**
```bash
cd project/backend
node createAdmin.js
```

### 2. Test the Application

1. Open browser: `http://localhost:5173`
2. Register a new user
3. Login with the user
4. For admin access:
   - Go to `http://localhost:5173/adminlogin`
   - Login with admin credentials
   - Access dashboard

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:8000/test
```
Should return: "Hi iam backend!"

### Frontend Check
Open `http://localhost:5173` in browser - should see the SkyBook landing page

### Database Check
Backend console should show: "database connected successfully"

## Common Ports
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- MongoDB: Connection string in `.env`

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify MongoDB connection string in `backend/.env`
- Run `npm install` in backend directory

### Frontend won't start
- Check if port 5173 is already in use
- Run `npm install` in project directory
- Clear node_modules and reinstall if needed

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes your IP
- Check username/password in connection string
- Ensure network connectivity

### CORS errors
- Verify backend is running on port 8000
- Check CORS is enabled in `backend/index.js`

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Postman or Thunder Client for API testing
3. **Database**: Use MongoDB Compass for database management
4. **Logs**: Check terminal output for errors

## Project URLs

- Home: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`
- Admin Login: `http://localhost:5173/adminlogin`
- Admin Dashboard: `http://localhost:5173/admin/dashboard`
- Flights: `http://localhost:5173/flights`
- Airports: `http://localhost:5173/airports`
- Reviews: `http://localhost:5173/reviews`

## API Documentation

See `FIXES_APPLIED.md` for complete API endpoint documentation.

## Need Help?

1. Check console logs in browser (F12)
2. Check terminal output for backend errors
3. Verify all dependencies are installed
4. Ensure MongoDB is accessible
5. Check `FIXES_APPLIED.md` for detailed information
