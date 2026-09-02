import {
  LayoutDashboard, BookOpen, Map, MessageSquare, NotebookPen, CreditCard, Award,
  CalendarDays, Users, ClipboardCheck, Mic, GraduationCap, Receipt, Eye, HelpCircle,
  Inbox, Settings, ShoppingBag, History,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };
export type NavSection = { title?: string; items: NavItem[] };

export const STUDENT_NAV: NavSection[] = [
  {
    items: [
      { href: "/student", label: "Dashboard", icon: LayoutDashboard },
      { href: "/student/courses", label: "My courses", icon: BookOpen },
      { href: "/student/study-map", label: "Study maps", icon: Map },
      { href: "/student/messages", label: "Message board", icon: MessageSquare },
      { href: "/student/journal", label: "Learning journal", icon: NotebookPen },
      { href: "/student/certificates", label: "Certificates", icon: Award },
      { href: "/student/assessments", label: "Assessments", icon: Mic },
      { href: "/student/fees", label: "Fees & invoices", icon: CreditCard },
      { href: "/student/logins", label: "Login history", icon: History },
    ],
  },
];

export const TEACHER_NAV: NavSection[] = [
  {
    items: [
      { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
      { href: "/teacher/classes", label: "My classes", icon: GraduationCap },
      { href: "/teacher/register", label: "Attendance register", icon: ClipboardCheck },
      { href: "/teacher/messages", label: "Message boards", icon: MessageSquare },
      { href: "/teacher/assessments", label: "Audio assessments", icon: Mic },
      { href: "/teacher/logins", label: "My hours", icon: History },
    ],
  },
];

export const ADMIN_NAV: NavSection[] = [
  {
    title: "People",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/students", label: "Student register", icon: Users },
      { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
      { href: "/admin/enrolments", label: "Enrolments", icon: BookOpen },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/billing", label: "Billing & invoices", icon: Receipt },
      { href: "/admin/classes", label: "Classes & timetable", icon: CalendarDays },
      { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/admin/observations", label: "Observations", icon: Eye },
      { href: "/admin/hours", label: "Staff hours", icon: History },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/bookings", label: "Bookings inbox", icon: Inbox },
      { href: "/admin/questions", label: "Ask the Mufti", icon: HelpCircle },
      { href: "/admin/shop", label: "Shop products", icon: ShoppingBag },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];
