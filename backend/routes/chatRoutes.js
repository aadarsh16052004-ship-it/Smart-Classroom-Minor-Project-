import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

function buildSystemPrompt(role) {
  return `You are SmartBot, the official AI assistant for SmartCMS — a Smart Classroom Management System.
Your ONLY job: help users understand and navigate SmartCMS features.
RULES:
- Answer ONLY questions about how to use SmartCMS.
- NEVER access or reveal personal user data (marks, attendance, assignments, etc).
- If asked personal data, say you can only help with platform usage and direct to the relevant page.
- NEVER answer off-topic questions (general knowledge, math, coding help, etc).
- Be concise, friendly, and use bullet points for steps.
User role: ${role}

=== SMARTCMS FEATURES ===
STUDENT: Dashboard (attendance %, pending assignments, marks overview, alerts), Attendance (view records by subject; join live session with teacher 4-digit code), Marks (view per subject by exam type MST1/MST2/FINAL), Assignments (view, submit text answers, see grades and remarks, resubmit if allowed), Lectures (access resource links), Subjects (view enrolled subjects), Alerts (Info/Warning/Emergency), Announcements (class announcements), Profile (update name/password).
TEACHER: Dashboard (subjects, students count, assignments issued, attendance sessions), Subjects (view enrolled students per subject), Students (list with detail modal), Assignments (create with title/description/due date/max marks, toggle resubmission), Attendance (create live session → get 4-digit code for students; manually mark; close session), Marks (enter MST1/MST2/FINAL marks per student), Lectures (upload resource links), Announcements (post class announcements), Resources (view/manage), Alerts (broadcast to students or all users with Info/Warning/Emergency level).
ADMIN: Dashboard (total users, students, teachers, subjects, resources), Users (view all, activate/deactivate), Subjects (manage), Timetable (weekly schedule), Alerts (post system-wide), Resources (add/manage), Enrollments (manage student-subject enrollment).
NAVIGATION: Left sidebar links to all pages. Collapse sidebar with arrow. Topbar shows notifications (students) and user avatar. SmartBot bubble bottom-right on every page.`;
}

router.post("/", protect, async (req, res) => {
  try {
    const { messages } = req.body;
    const role = req.user?.role || "student";

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "AI service not configured. Add ANTHROPIC_API_KEY to backend .env" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: buildSystemPrompt(role),
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await response.json();
    const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I could not generate a response.";
    res.json({ reply });

  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

export default router;
