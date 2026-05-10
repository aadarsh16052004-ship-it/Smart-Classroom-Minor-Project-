import { useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

const navItems = [
  { path:"/admin",              label:"Dashboard",    },
  { path:"/admin/users",        label:"Users",        },
  { path:"/admin/enrollments",  label:"Enrollments",  },
  { path:"/admin/subjects",     label:"Subjects",     },
  { path:"/admin/timetable",    label:"Timetable",    },
  { path:"/admin/resources",    label:"Resources",    },
  { path:"/admin/alerts",       label:"Alerts",       },
  { path:"/admin/chat",         label:"SmartBot",     },
];

const ACCENT = "#f59e0b";
const QUICK = ["How do I activate or deactivate a user?", "How do I enroll a student?", "How do I add a timetable entry?", "How do I add a resource?", "What does the dashboard show?", "How do I create a subject?"];


/* ── Knowledge base ─────────────────────────────────────── */
const KB_SHARED = [
  { match:["hello","hi","hey","hii","good morning","good afternoon","good evening"],
    answer:"Hi there!  I'm **SmartBot**, your SmartCMS guide.\n\nAsk me anything about how to use the platform!" },
  { match:["help","what can you do","capabilities","assist"],
    answer:"I can help you with:\n• How to navigate SmartCMS\n• Understanding any feature\n• Step-by-step instructions\n\nJust ask about any page or feature!" },
  { match:["navigate","navigation","sidebar","menu","pages","go to","where is","find"],
    answer:"**Navigating SmartCMS:**\n• Use the **left sidebar** to switch between pages\n• Click the ← arrow to collapse the sidebar\n• Top bar shows notifications and your avatar" },
  { match:["logout","log out","sign out","exit"],
    answer:"**To log out:**\n• Click the  **Logout** button at the bottom of the left sidebar\n• You'll be returned to the login page" },
  { match:["login","sign in","password","forgot","credentials"],
    answer:"**Logging in:**\n• Enter your email and password on the main page\n• You'll be redirected to your dashboard automatically\n\nForgot password? Contact your system administrator." },
  { match:["who are you","what are you","smartbot","chatbot","bot","assistant"],
    answer:"I'm **SmartBot**  — the built-in assistant for SmartCMS!\n\nI answer questions about how to use platform features. I don't have access to your personal data." },
  { match:["personal","my data","my marks","my attendance","private"],
    answer:"I don't have access to personal data. Navigate to the relevant page in the sidebar (Marks, Attendance, etc.) to see your own information." },
  { match:["alert","alerts","emergency","warning","notification","broadcast"],
    answer:"**Alerts:**\n• Three levels:  Info,  Warning,  Emergency\n• Students: check the **Alerts** page or  bell in the top bar\n• Teachers/Admins: go to **Alerts** in the sidebar to post new alerts" },
  { match:["announcement","announcements","class notice","notice board"],
    answer:"**Announcements:**\n• Class-specific messages posted by teachers\n• Students: go to **Announcements** in the sidebar\n• Teachers: go to **Announcements** → **New Announcement** → fill in title and content → post" },
  { match:["lecture","lectures","resource link","material","notes","video","study"],
    answer:"**Lectures & Resources:**\n• Teachers upload resource links (videos, docs, slides) per subject\n• Students: go to **Lectures** in the sidebar\n• Teachers: go to **Lectures** → **Add Lecture** → fill in title, subject, and URL" },
  { match:["timetable","schedule","class schedule","timing","period"],
    answer:"**Timetable:**\n• Shows your weekly class schedule by day\n• Go to **Timetable** in the sidebar\n• Today's schedule is highlighted automatically" },
  { match:["subject","subjects","course","enrolled","enroll","enrollment"],
    answer:"**Subjects:**\n• Students: go to **Subjects** to see enrolled subjects\n• Enrollment is managed by the Admin\n• Teachers see their assigned subjects on the Dashboard" },
  { match:["profile","account","update name","change password","edit profile"],
    answer:"**Updating your profile:**\n• Go to **Profile** in the sidebar\n• Update your full name\n• To change password: enter current password, new password, confirm → save\n• Email cannot be changed — contact an admin if needed" },
  { match:["dashboard","overview","home","summary","stats"],
    answer:"**Dashboard:**\n• First page after login — shows your key stats\n• Displays attendance, assignments, marks, and alerts summary\n• Refreshes automatically when you load the page" },
];

const KB_STUDENT = [
  { match:["join session","session code","4 digit","live session","mark attendance","present","attendance code"],
    answer:"**Joining a live attendance session:**\n1. Go to **Attendance** in the sidebar\n2. Find the **Join Live Session** card\n3. Enter the **4-digit code** from your teacher\n4. Click **Mark Present**\n\n The code only works while the teacher keeps the session open." },
  { match:["attendance percentage","below 75","75 percent","shortage","risk","detained","low attendance"],
    answer:"**Attendance percentage:**\n• Below **75%** is highlighted in red — you're at risk\n• Subject-wise percentages shown as bars (Green = safe, Red = at risk)\n• Overall % shown on Dashboard and Attendance page" },
  { match:["submit assignment","submission","answer","pending","due","deadline","overdue","assignment"],
    answer:"**Submitting an assignment:**\n1. Go to **Assignments** in the sidebar\n2. Find the pending assignment\n3. Click **Submit ↑**\n4. Type your answer in the text box\n5. Click **✓ Submit**\n\nAfter grading you'll see marks and remarks on the same card." },
  { match:["resubmit","resubmission","update submission","edit submission","change answer"],
    answer:"**Resubmitting:**\n• If the teacher allowed it, you'll see a 🔄 **Resubmit** button\n• Click it, update your answer, and click ** Update**\n• Not all assignments allow resubmission — depends on the teacher" },
  { match:["marks","grades","score","result","mst","mst1","mst2","final","exam"],
    answer:"**Viewing your marks:**\n• Go to **Marks** in the sidebar\n• Filter by exam type: All / MST1 / MST2 / FINAL\n• Each row shows subject, exam, marks, max, and a percentage bar\n• Green ≥75%, Yellow ≥50%, Red <50%" },
];

const KB_TEACHER = [
  { match:["create session","start session","live session","generate code","take attendance","open session","attendance session"],
    answer:"**Creating a live attendance session:**\n1. Go to **Attendance** in the sidebar\n2. Click **Create Session** and select the subject\n3. A **4-digit code** is generated — share it with students\n4. Students join using that code\n5. Click **Close Session** when done" },
  { match:["grade","grading","mark submission","review submission","give marks","remarks","feedback","check submission"],
    answer:"**Grading a submission:**\n1. Go to **Assignments** in the sidebar\n2. Expand the assignment to see student submissions\n3. Enter marks and optional remarks for each student\n4. Click **Save** to confirm\n\nStudents see their marks and remarks immediately." },
  { match:["create assignment","new assignment","post assignment","add assignment","due date","max marks","assignment"],
    answer:"**Creating an assignment:**\n1. Go to **Assignments** → **New Assignment**\n2. Fill in: Title, Description, Subject, Due Date, Max Marks\n3. Toggle **Allow Resubmission** if needed\n4. Click **Create**\n\nAll enrolled students in that subject will see it immediately." },
  { match:["enter marks","input marks","record marks","marks entry","add marks","mst","final exam"],
    answer:"**Entering student marks:**\n1. Go to **Enter Marks** in the sidebar\n2. Select subject and exam type (MST1 / MST2 / FINAL)\n3. Enter marks for each student in the list\n4. Click **Save Marks**" },
  { match:["upload lecture","add lecture","post lecture","resource link","add resource"],
    answer:"**Uploading a lecture resource:**\n1. Go to **Lectures** → **Add Lecture**\n2. Fill in: Title, Subject, Resource URL, optional Description\n3. Click **Save**\n\nStudents in that subject will see it on their Lectures page." },
  { match:["post alert","create alert","send alert","new alert","broadcast","emergency","warning alert"],
    answer:"**Broadcasting an alert:**\n1. Go to **Alerts** → **New Alert**\n2. Write your message\n3. Select level: Info / Warning / Emergency\n4. Choose audience: Students only or All users\n5. Click **Post**" },
  { match:["view students","student list","my students","student detail","student modal","submissions","who submitted"],
    answer:"**Viewing students:**\n• Go to **Students** in the sidebar\n• Click a student to open a detail modal (attendance, marks, submissions)\n• Go to **Assignments** and expand an assignment to see all submissions\n• Ungraded = Pending (amber), Graded = ✓ Graded (green)" },
];

const KB_ADMIN = [
  { match:["activate","deactivate","disable","enable","user","users","manage users","block user"],
    answer:"**Managing users:**\n1. Go to **Users** in the sidebar\n2. See all registered users with role and status\n3. Click **Activate** or **Deactivate** next to a user\n4. Deactivated users cannot log in until reactivated" },
  { match:["enroll","enrollment","enrollments","add student","assign subject","unenrolled"],
    answer:"**Managing enrollments:**\n1. Go to **Enrollments** in the sidebar\n2. Select a student and a subject\n3. Click **Enroll** to add them\n4. To remove: find the enrollment and click **Remove**" },
  { match:["add subject","create subject","new subject","manage subjects","subject code","assign teacher"],
    answer:"**Managing subjects:**\n1. Go to **Subjects** → **Add Subject**\n2. Enter subject name, code, and assign a teacher\n3. Click **Save**\n\nThen enroll students via the Enrollments page." },
  { match:["timetable","add timetable","schedule","period","day","time slot"],
    answer:"**Adding a timetable entry:**\n1. Go to **Timetable** → **Add Entry**\n2. Select: Day, Subject, Start Time, End Time\n3. Click **Save**\n\nStudents enrolled in that subject will see it on their Timetable." },
  { match:["resource","resources","add resource","hardware","software","available","allocated"],
    answer:"**Managing resources:**\n1. Go to **Resources** → **Add Resource**\n2. Fill in name, type, and quantity\n3. Resources show Available or Allocated status" },
  { match:["admin dashboard","system overview","total users","total students","system stats"],
    answer:"**Admin Dashboard shows:**\n• Total users, students, teachers, subjects, resources\n• Subject enrollment chart\n• Resource availability\n• Recently registered users\n• System-wide alert count" },
];

function getAnswer(message, role) {
  const msg = message.toLowerCase().trim();
  const roleKB = role === "student" ? KB_STUDENT : role === "teacher" ? KB_TEACHER : KB_ADMIN;
  const all = [...KB_SHARED, ...roleKB];
  let best = 0, answer = null;
  for (const entry of all) {
    let score = 0;
    for (const kw of entry.match) {
      if (msg.includes(kw)) score += kw.includes(" ") ? 3 : 1;
    }
    if (score > best) { best = score; answer = entry.answer; }
  }
  if (best === 0) return "I'm not sure about that. I can only help with **SmartCMS platform questions**.\n\nTry asking about:\n• Attendance, assignments, or marks\n• Navigation or a specific page\n• How to do something in the system\n\nOr pick one of the quick questions below! ";
  return answer;
}

const renderText = (text) =>
  text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    const isBullet = line.startsWith("• ") || line.startsWith("- ");
    return (
      <div key={i} style={{ marginBottom:2, display:isBullet?"flex":"block", gap:isBullet?4:0, paddingLeft:isBullet?4:0 }}>
        {isBullet && <span style={{ flexShrink:0 }}>•</span>}
        <span>{isBullet ? rendered.slice(1) : rendered}</span>
      </div>
    );
  });


export default function AdminChatPage() {
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [inited, setInited]     = useState(false);
  const role = user?.role || "admin";

  const init = useCallback(() => {
    if (inited) return;
    setMessages([{ role:"assistant", content:`Hi ${user?.name?.split(" ")[0]||"there"} 👋 I\'m **SmartBot** — your SmartCMS guide!\n\nAsk me anything about how to use the platform and I\'ll answer instantly.` }]);
    setInited(true);
  }, [inited, user]);

  useCallback(() => { init(); }, []);
  useState(() => { init(); });

  const scrollBottom = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 50);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    const botReply = getAnswer(msg, role);
    setMessages(prev => [...prev, { role:"user", content:msg }, { role:"assistant", content:botReply }]);
    scrollBottom();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const showQuick = messages.length <= 1;

  return (
    <Layout navItems={navItems}>
      <PageHeader title="🤖 SmartBot" subtitle="Platform assistant — instant answers, no internet required" />
      <div style={{ maxWidth:680, background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, display:"flex", flexDirection:"column", height:"calc(100vh - 200px)" }}>
        <div style={{ padding:"14px 20px", background:ACCENT, borderRadius:"14px 14px 0 0", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>SmartBot</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Always online · Instant answers · No API needed</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80" }} />
            <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Online</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", background:"#f8f9fb", display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-end", flexDirection:m.role==="user"?"row-reverse":"row" }}>
              <div style={{ maxWidth:"76%", padding:"10px 14px", borderRadius:12, fontSize:13.5, lineHeight:1.6,
                background:m.role==="user"?`${ACCENT}12`:"#fff",
                border:m.role==="user"?`1px solid ${ACCENT}28`:"1px solid #e2e8f0",
                color:m.role==="user"?ACCENT:"#1e293b",
                borderBottomRightRadius:m.role==="user"?4:12,
                borderBottomLeftRadius:m.role==="assistant"?4:12,
              }}>
                {renderText(m.content)}
              </div>
            </div>
          ))}
          {showQuick && (
            <div style={{ marginTop:4 }}>
              <p style={{ color:"#94a3b8", fontSize:11.5, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>Common questions</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {QUICK.map((q, i) => (
                  <button key={i} onClick={()=>sendMessage(q)}
                    style={{ fontSize:12.5, padding:"6px 13px", borderRadius:20, border:`1px solid ${ACCENT}44`, color:ACCENT, background:"#fff", cursor:"pointer" }}>{q}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding:"12px 14px", borderTop:"1px solid #e2e8f0", background:"#fff", borderRadius:"0 0 14px 14px", display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }}
            placeholder="Ask about any SmartCMS feature..." rows={1}
            style={{ flex:1, resize:"none", borderRadius:9, border:"1px solid #e2e8f0", padding:"9px 13px", fontSize:13.5, outline:"none", fontFamily:"inherit", color:"#1e293b", maxHeight:90 }}
            onFocus={e=>e.target.style.borderColor=ACCENT} onBlur={e=>e.target.style.borderColor="#e2e8f0"}
            onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,90)+"px";}}
          />
          <button onClick={()=>sendMessage()} disabled={!input.trim()}
            style={{ width:36, height:36, borderRadius:9, background:!input.trim()?"#e2e8f0":ACCENT, border:"none", color:!input.trim()?"#94a3b8":"#fff", cursor:!input.trim()?"not-allowed":"pointer", fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            ➤
          </button>
        </div>
      </div>
    </Layout>
  );
}
