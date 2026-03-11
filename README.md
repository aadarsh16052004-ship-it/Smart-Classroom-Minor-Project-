# Smart Classroom Management System

## Setup Instructions

### Backend
```bash
cd backend
npm install
# Make sure your .env has:
# MONGO_URI=mongodb://127.0.0.1:27017/smart_classroom
# JWT_SECRET=supersecretkey
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login Credentials
| Role    | Email              | Password     |
|---------|--------------------|--------------|
| Admin   | admin@cms.com      | password123  |
| Teacher | teacher@cms.com    | password123  |
| Student | rahul@cms.com      | password123  |

## Features

### Student
- Dashboard with attendance gauge, alerts, stats
- Attendance view with subject-wise bar chart + join live session via code
- Assignments list with Pending/Submitted status
- Marks with percentage progress bars
- Timetable grouped by day
- Lectures with resource links
- Subjects with teacher info
- Alerts with color-coded urgency levels

### Teacher
- Dashboard with teaching overview stats
- Subjects management
- Students directory with search
- Create assignments, view submission counts
- Attendance session creation (generate code → students join → close to finalize)
- Enter marks (MST1/MST2/FINAL)
- Upload lecture resources
- Resource allocation/release

### Admin
- Dashboard with system-wide stats
- User management with activate/deactivate
- Subject creation with teacher assignment
- Timetable scheduling
- Resource management (add/delete)
- Broadcast alerts with urgency levels to students/teachers/all
