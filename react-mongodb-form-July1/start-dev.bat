@echo off
echo Starting MERN Profile Registry application...
echo.

:: Start Backend in a new window
echo Starting Backend Server on Port 5000...
start "Backend API Server" cmd /k "cd backend && npm run dev"

:: Start Frontend in a new window
echo Starting Frontend Client on Port 5173...
start "React Client" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started successfully inside separate terminal windows.
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:5000
echo.
pause
