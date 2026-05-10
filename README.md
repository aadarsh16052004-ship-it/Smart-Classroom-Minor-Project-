Smart Classroom Management System

Setup Instructions

Backend :
        cd backend
        npm install
        node server.js


Frontend:
        cd frontend
        npm install
        npm run dev


Demo Login Credentials
Admin : admin@cms.com and password123 
Teacher : teacher@cms.com and password123 
Student : rahul@cms.com and password123  

Features : 

1.Student: 
        - Dashboard with attendance gauge, alerts, stats
        - Attendance view with subject-wise bar chart + join live session via code
        - Assignments list with Pending/Submitted status
        - Marks with percentage progress bars
        - Timetable grouped by day
        - Lectures with resource links
        - Subjects with teacher info
        - Alerts with color-coded urgency levels

2.Teacher : 
        - Dashboard with teaching overview stats
        - Subjects management
        - Students directory with search
        - Create assignments, view submission counts
        - Attendance session creation (generate code → students join → close to finalize)
        - Enter marks (MST1/MST2/FINAL)
        - Upload lecture resources
        - Resource allocation/release

3.Admin :
        - Dashboard with system-wide stats
        - User management with activate/deactivate
        - Subject creation with teacher assignment
        - Timetable scheduling
        - Resource management (add/delete)
        - Broadcast alerts with urgency levels to students/teachers/all
