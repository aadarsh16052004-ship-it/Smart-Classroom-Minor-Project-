import { useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const roleAccent = { admin:"#f59e0b", teacher:"#10b981", student:"#4f46e5" };

/* ═══════════════════════════════════════════════════════════
   RULE-BASED BRAIN
   Each entry: { match: [keywords], answer: "..." }
   The engine scores every entry by how many keywords match
   the user's message, then picks the highest scorer.
═══════════════════════════════════════════════════════════ */
const KB = {
  // ── SHARED ──────────────────────────────────────────────
  shared: [
    {
      match: ["hello","hi","hey","hii","good morning","good afternoon","good evening","howdy","greetings"],
      answer: "Hi there!  I'm **SmartBot**, your SmartCMS guide.\n\nAsk me anything about how to use the platform — navigation, features, or how to do something specific!",
    },
    {
      match: ["help","what can you do","what do you know","capabilities","assist"],
      answer: "I can help you with:\n• How to navigate SmartCMS\n• Understanding any feature\n• Step-by-step instructions\n• Troubleshooting platform usage\n\nJust ask me about any page or feature you need help with!",
    },
    {
      match: ["navigate","navigation","sidebar","menu","pages","go to","where is","find"],
      answer: "**Navigating SmartCMS:**\n• Use the **left sidebar** to switch between pages\n• Click the ← arrow at the bottom of the sidebar to collapse it for more space\n• Your name and role are shown at the bottom of the sidebar\n• The top bar shows your notifications (students) and avatar",
    },
    {
      match: ["logout","log out","sign out","exit","leave"],
      answer: "**To log out:**\n• Click the  **Logout** button at the bottom of the left sidebar\n• You'll be returned to the login page\n• Your session is cleared automatically",
    },
    {
      match: ["login","log in","sign in","password","forgot","credentials"],
      answer: "**Logging in:**\n• Go to the main page and enter your email and password\n• Click **Sign In**\n• You'll be redirected to your role's dashboard automatically\n\nIf you forgot your password, contact your system administrator.",
    },
    {
      match: ["smartbot","chatbot","bot","ai","assistant","you","who are you","what are you"],
      answer: "I'm **SmartBot**  — the built-in assistant for SmartCMS!\n\nI can answer questions about how to use any feature of the platform. I don't have access to your personal data — I'm here purely to guide you through the system.",
    },
    {
      match: ["personal","my data","my marks","my attendance","my assignments","my info","private"],
      answer: "I don't have access to any personal data — I can only help with **how to use** the platform.\n\nTo see your personal data, navigate to the relevant page from the sidebar (e.g. Marks, Attendance, Assignments).",
    },
    {
      match: ["alert","alerts","notice","emergency","warning","info","notification","broadcast"],
      answer: "**Alerts & Notifications:**\n• Alerts are system-wide messages from teachers or admins\n• Three levels: ℹ️ **Info**, ⚠️ **Warning**, 🚨 **Emergency**\n• Students: check the **Alerts** page in the sidebar or the 🔔 bell in the top bar\n• Teachers/Admins: go to **Alerts** in the sidebar to post a new alert",
    },
    {
      match: ["announcement","announcements","class notice","notice board"],
      answer: "**Announcements:**\n• Class-specific messages posted by teachers\n• Students: go to **Announcements** in the sidebar to read them\n• Teachers: go to **Announcements** in the sidebar, click **New Announcement**, fill in the title and content, then post",
    },
    {
      match: ["lecture","lectures","resource","resources","link","material","study material","notes","video"],
      answer: "**Lectures & Resources:**\n• Teachers upload resource links (videos, docs, slides) per subject\n• Students: go to **Lectures** in the sidebar to see all links\n• Teachers: go to **Lectures** → click **Add Lecture** → fill in title, subject, and the resource URL",
    },
    {
      match: ["timetable","schedule","time table","class schedule","when","timing","period"],
      answer: "**Timetable:**\n• Shows your weekly class schedule by day\n• Navigate to **Timetable** in the sidebar\n• Today's schedule is highlighted automatically\n• Admins manage and create timetable entries from the admin panel",
    },
    {
      match: ["subject","subjects","course","courses","enrolled","enroll","enrollment"],
      answer: "**Subjects & Enrollment:**\n• Students: go to **Subjects** in the sidebar to see your enrolled subjects with teacher and student count\n• Enrollment is managed by the **Admin** — contact them if you need to be added to a subject\n• Teachers see their assigned subjects on the Dashboard and Subjects page",
    },
    {
      match: ["profile","account","update name","change name","change password","update password","edit profile"],
      answer: "**Updating your profile:**\n• Go to **Profile** in the sidebar (students) or bottom of sidebar\n• You can update your **full name**\n• To change your password: enter your current password, then the new one, confirm it and save\n• Email cannot be changed — contact an admin if needed",
    },
    {
      match: ["register","registration","new account","create account","sign up","new user"],
      answer: "**Creating an account:**\n• Go to the login page and click **Create Account**\n• Enter your name, email, password and select your role (Student or Teacher)\n• Admin accounts are created manually by system administrators\n• After registration you'll be logged in automatically, but you'll have no subjects yet — an admin will enroll you",
    },
    {
      match: ["dashboard","overview","home","summary","stats"],
      answer: "**Dashboard:**\n• Your dashboard is the first page you see after login\n• It shows a summary of your key stats — attendance, assignments, marks, alerts\n• Click any stat card to navigate to that section\n• It refreshes automatically when you load the page",
    },
  ],

  // ── STUDENT ─────────────────────────────────────────────
  student: [
    {
      match: ["attendance","present","absent","mark attendance","join session","session code","code","4 digit","live session","how to mark"],
      answer: "**Joining a live attendance session:**\n1. Go to **Attendance** in the sidebar\n2. Find the **Join Live Session** card on the right\n3. Enter the **4-digit code** given by your teacher\n4. Click **Mark Present**\n5. You'll get a success message when done\n\n⚠️ The code is only active while the teacher keeps the session open.",
    },
    {
      match: ["attendance percentage","attendance %","below 75","75 percent","shortage","risk","detained","low attendance"],
      answer: "**About your attendance percentage:**\n• Your overall % is shown on the Dashboard and Attendance page\n• A percentage **below 75%** is highlighted in red — you're at risk\n• Subject-wise percentages are shown as bars in the Attendance page\n• Green = safe (≥75%), Red = at risk (<75%)",
    },
    {
      match: ["assignment","submit","submission","answer","text","pending","due","deadline","overdue"],
      answer: "**Submitting an assignment:**\n1. Go to **Assignments** in the sidebar\n2. Find the assignment (Pending ones are highlighted)\n3. Click **Submit ↑**\n4. Type your answer in the text box\n5. Click **✓ Submit**\n\nAfter grading, you'll see your marks and remarks on the same card.",
    },
    {
      match: ["resubmit","resubmission","update submission","edit submission","change answer"],
      answer: "**Resubmitting an assignment:**\n• If the teacher allowed resubmission, you'll see a 🔄 **Resubmit** button on the submitted assignment\n• Click it, update your answer, and click **🔄 Update**\n• Not all assignments allow resubmission — it depends on the teacher's setting",
    },
    {
      match: ["marks","grades","score","result","mst","mst1","mst2","final","exam","obtained"],
      answer: "**Viewing your marks:**\n• Go to **Marks** in the sidebar\n• Use the filter buttons (All / MST1 / MST2 / FINAL) to filter by exam type\n• Each row shows subject, exam type, marks obtained, max marks, and a percentage bar\n• Green = good (≥75%), Yellow = average (≥50%), Red = low (<50%)",
    },
  ],

  // ── TEACHER ─────────────────────────────────────────────
  teacher: [
    {
      match: ["create session","start session","live session","attendance session","session code","generate code","take attendance","open session"],
      answer: "**Creating a live attendance session:**\n1. Go to **Attendance** in the sidebar\n2. Click **Create Session**\n3. Select the subject\n4. A **4-digit code** is generated — share it with your students\n5. Students join using that code\n6. Click **Close Session** when done\n\nYou can also manually mark students as present/absent from the session view.",
    },
    {
      match: ["grade","grading","mark submission","review submission","check submission","give marks","give grades","remarks","feedback"],
      answer: "**Grading a student submission:**\n1. Go to **Assignments** in the sidebar\n2. Find the assignment and click to expand it\n3. You'll see a list of all student submissions\n4. Enter marks and optional remarks for each student\n5. Click **Save** to confirm the grade\n\nStudents will see their marks and remarks immediately.",
    },
    {
      match: ["create assignment","new assignment","post assignment","add assignment","assignment","due date","max marks"],
      answer: "**Creating a new assignment:**\n1. Go to **Assignments** in the sidebar\n2. Click **New Assignment**\n3. Fill in: Title, Description, Subject, Due Date, Max Marks\n4. Toggle **Allow Resubmission** if you want students to be able to update their answer\n5. Click **Create**\n\nAll enrolled students in that subject will see the assignment immediately.",
    },
    {
      match: ["resubmission","allow resubmission","toggle resubmission","enable resubmission"],
      answer: "**Toggling resubmission:**\n• When creating an assignment, toggle the **Allow Resubmission** switch ON\n• Students will then see a 🔄 Resubmit button after submitting\n• You can also update this setting after the assignment is created from the assignment detail view",
    },
    {
      match: ["enter marks","input marks","record marks","marks entry","add marks","mst","mst1","mst2","final exam"],
      answer: "**Entering student marks:**\n1. Go to **Enter Marks** in the sidebar\n2. Select the subject and exam type (MST1 / MST2 / FINAL)\n3. A list of enrolled students appears\n4. Enter marks for each student\n5. Click **Save Marks**\n\nStudents will see their marks on their Marks page immediately.",
    },
    {
      match: ["upload lecture","add lecture","post lecture","new lecture","resource link","add resource link"],
      answer: "**Uploading a lecture resource:**\n1. Go to **Lectures** in the sidebar\n2. Click **Add Lecture**\n3. Fill in: Title, Subject, Resource URL (YouTube, Google Drive, etc), and optional Description\n4. Click **Save**\n\nStudents in that subject will see the link on their Lectures page.",
    },
    {
      match: ["post alert","create alert","send alert","new alert","broadcast","emergency alert","warning alert"],
      answer: "**Broadcasting an alert:**\n1. Go to **Alerts** in the sidebar\n2. Click **New Alert**\n3. Write your message\n4. Select level: **Info** / **Warning** / **Emergency**\n5. Choose audience: Students only or All users\n6. Click **Post**\n\nAll targeted users will see it immediately on their Alerts page and notification bell.",
    },
    {
      match: ["view students","student list","my students","enrolled students","student detail","student info","student modal"],
      answer: "**Viewing your students:**\n• Go to **Students** in the sidebar to see all students enrolled in your subjects\n• Click on a student to open a **detail modal** showing their attendance, marks and submissions\n• Use the subject filter to narrow down the list",
    },
    {
      match: ["submission","submissions","view submissions","pending submission","who submitted","ungraded"],
      answer: "**Viewing submissions:**\n• Go to **Assignments** in the sidebar\n• Expand an assignment to see all student submissions\n• Ungraded submissions are marked **Pending** in amber\n• Graded ones show **✓ Graded** in green\n• You can filter by subject to manage workload",
    },
  ],

  // ── ADMIN ────────────────────────────────────────────────
  admin: [
    {
      match: ["activate","deactivate","disable","enable","user","users","manage users","user list","block user"],
      answer: "**Managing users:**\n1. Go to **Users** in the sidebar\n2. You'll see all registered users with their role and status\n3. Click **Activate** or **Deactivate** next to a user\n4. Deactivated users cannot log in until reactivated\n\nYou can filter by role (Student / Teacher / Admin) to find users faster.",
    },
    {
      match: ["enroll","enrollment","enrollments","add student","assign subject","student subject","unenrolled"],
      answer: "**Managing enrollments:**\n1. Go to **Enrollments** in the sidebar\n2. Select a student and a subject\n3. Click **Enroll** to add them\n4. To remove: find the enrollment and click **Remove**\n\nStudents with no enrollments are flagged on the Dashboard as unenrolled.",
    },
    {
      match: ["add subject","create subject","new subject","manage subjects","subject code","assign teacher"],
      answer: "**Managing subjects:**\n1. Go to **Subjects** in the sidebar\n2. Click **Add Subject**\n3. Enter subject name, code, and assign a teacher\n4. Click **Save**\n\nOnce created, enroll students via the Enrollments page.",
    },
    {
      match: ["timetable","add timetable","create timetable","new timetable","schedule","period","day","time slot"],
      answer: "**Adding a timetable entry:**\n1. Go to **Timetable** in the sidebar\n2. Click **Add Entry**\n3. Select: Day, Subject, Start Time, End Time\n4. Click **Save**\n\nStudents enrolled in that subject will see it on their Timetable page.",
    },
    {
      match: ["resource","resources","add resource","new resource","hardware","software","available","allocated"],
      answer: "**Managing resources:**\n1. Go to **Resources** in the sidebar\n2. Click **Add Resource** to add new hardware/software\n3. Fill in name, type, and quantity\n4. Resources show as Available or Allocated\n5. Teachers can request allocation from their Resources page",
    },
    {
      match: ["admin dashboard","system overview","total users","total students","total teachers","system stats"],
      answer: "**Admin Dashboard shows:**\n• Total users, students, teachers\n• Total subjects and resources\n• Subject enrollment chart\n• Resource availability (available vs allocated)\n• Recently registered users\n• System-wide alert count\n\nAll numbers update when you refresh the page.",
    },
  ],
};

/* ── Scoring engine ─────────────────────────────────────── */
function getAnswer(message, role) {
  const msg = message.toLowerCase().trim();
  const words = msg.split(/\s+/);

  const sources = [...KB.shared, ...(KB[role] || [])];
  let bestScore = 0;
  let bestAnswer = null;

  for (const entry of sources) {
    let score = 0;
    for (const kw of entry.match) {
      if (msg.includes(kw)) score += kw.includes(" ") ? 3 : 1; // multi-word = higher weight
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  // Minimum threshold — must match at least one keyword
  if (bestScore === 0) {
    return `I'm not sure about that. I can only help with **SmartCMS platform questions**.\n\nTry asking about:\n• Attendance, assignments, marks\n• Navigation or a specific page\n• How to do something in the system\n\nOr pick one of the quick questions below! 👇`;
  }

  return bestAnswer;
}

/* ── Quick questions per role ───────────────────────────── */
const QUICK = {
  student: [
    "How do I join a live attendance session?",
    "How do I submit an assignment?",
    "Where can I see my marks?",
    "How do I view lectures?",
    "What do the alert levels mean?",
  ],
  teacher: [
    "How do I create a live attendance session?",
    "How do I grade a submission?",
    "How do I create an assignment?",
    "How do I upload a lecture?",
    "How do I post an alert?",
  ],
  admin: [
    "How do I activate or deactivate a user?",
    "How do I enroll a student?",
    "How do I add a timetable entry?",
    "How do I add a resource?",
    "What does the dashboard show?",
  ],
};

/* ── Render markdown-lite ───────────────────────────────── */
const renderText = (text) =>
  text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    const isBullet = line.startsWith("• ") || line.startsWith("- ");
    return (
      <div key={i} style={{ marginBottom: 2, display: isBullet ? "flex" : "block", gap: isBullet ? 4 : 0, paddingLeft: isBullet ? 4 : 0 }}>
        {isBullet && <span style={{ flexShrink: 0 }}>•</span>}
        <span>{isBullet ? rendered.slice(1) : rendered}</span>
      </div>
    );
  });

/* ═══════════════════════════════════════════════════════════
   CHATBOT COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Chatbot() {
  const { user }  = useAuth();
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [inited, setInited]     = useState(false);

  const role      = user?.role || "student";
  const accent    = roleAccent[role] || "#4f46e5";
  const quickQs   = QUICK[role] || [];
  const firstName = user?.name?.split(" ")[0] || "there";

  const init = useCallback(() => {
    if (inited) return;
    setMessages([{
      role: "assistant",
      content: `Hi ${firstName}  I'm **SmartBot** — your SmartCMS guide!\n\nAsk me anything about how to use the platform and I'll walk you through it instantly.`,
    }]);
    setInited(true);
  }, [inited, firstName]);

  const scrollBottom = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const handleOpen = () => { setOpen(o => !o); init(); };

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    const userMsg  = { role: "user", content: msg };
    const botReply = { role: "assistant", content: getAnswer(msg, role) };

    setMessages(prev => [...prev, userMsg, botReply]);
    scrollBottom();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const showQuick = messages.length <= 1;

  return (
    <>
      {/* Bubble */}
      <button onClick={handleOpen}
        style={{ position:"fixed", bottom:24, right:24, zIndex:1000, width:52, height:52, borderRadius:"50%", background:accent, border:"none", color:"#fff", fontSize:22, cursor:"pointer", boxShadow:`0 4px 20px ${accent}66`, display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.2s" }}
        title="SmartBot — Platform Assistant"
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "🤖"}
      </button>

      {!open && <span style={{ position:"fixed", bottom:68, right:24, zIndex:1000, width:10, height:10, borderRadius:"50%", background:"#22c55e", border:"2px solid #fff" }} />}

      {open && (
        <div style={{ position:"fixed", bottom:86, right:24, zIndex:999, width:340, height:500, background:"#fff", borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", display:"flex", flexDirection:"column", overflow:"hidden", border:"1px solid #e2e8f0", animation:"slideUp 0.2s ease" }}>

          {/* Header */}
          <div style={{ padding:"14px 16px", background:accent, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🤖</div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:13.5 }}>SmartBot</div>
                <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11 }}>Always online · Instant answers</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.8)", fontSize:18, cursor:"pointer" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px", background:"#f8f9fb", display:"flex", flexDirection:"column", gap:10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection:m.role==="user"?"row-reverse":"row" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:m.role==="user"?accent:"#475569", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#fff", fontWeight:700 }}>
                  {m.role==="user" ? user?.name?.[0]?.toUpperCase() : "🤖"}
                </div>
                <div style={{ maxWidth:"78%", padding:"9px 12px", borderRadius:12, fontSize:13, lineHeight:1.6,
                  background: m.role==="user" ? `${accent}15` : "#fff",
                  border: m.role==="user" ? `1px solid ${accent}30` : "1px solid #e2e8f0",
                  color: m.role==="user" ? accent : "#1e293b",
                  borderBottomRightRadius: m.role==="user" ? 4 : 12,
                  borderBottomLeftRadius:  m.role==="assistant" ? 4 : 12,
                }}>
                  {renderText(m.content)}
                </div>
              </div>
            ))}

            {showQuick && (
              <div style={{ marginTop:4 }}>
                <div style={{ color:"#94a3b8", fontSize:11, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8, fontWeight:600 }}>Common questions</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {quickQs.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      style={{ fontSize:11.5, padding:"5px 10px", borderRadius:20, border:`1px solid ${accent}44`, color:accent, background:"#fff", cursor:"pointer", textAlign:"left" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid #e2e8f0", background:"#fff", display:"flex", gap:8, alignItems:"flex-end" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask anything about SmartCMS..." rows={1}
              style={{ flex:1, resize:"none", borderRadius:8, border:"1px solid #e2e8f0", padding:"8px 11px", fontSize:13, outline:"none", fontFamily:"inherit", color:"#1e293b", maxHeight:80, lineHeight:1.5 }}
              onInput={e => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,80)+"px"; }}
              onFocus={e => e.target.style.borderColor=accent}
              onBlur={e => e.target.style.borderColor="#e2e8f0"}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim()}
              style={{ width:34, height:34, borderRadius:8, background:!input.trim()?"#e2e8f0":accent, border:"none", color:!input.trim()?"#94a3b8":"#fff", cursor:!input.trim()?"not-allowed":"pointer", fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}
