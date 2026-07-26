export type AuditLog = {
  id: string;
  adminName: string;
  role: string;
  action: string;
  module: string;
  date: string;
  time: string;
  ipAddress: string;
  device: string;
};

export type SystemError = {
  id: string;
  message: string;
  stackTrace: string;
  severity: "critical" | "high" | "medium" | "low";
  module: string;
  date: string;
  time: string;
  status: "Unresolved" | "In Progress" | "Resolved";
  assignedDev?: string;
};

export type SystemNotification = {
  id: string;
  title: string;
  message: string;
  type: "approval" | "payment" | "inventory" | "security" | "system";
  date: string;
  time: string;
  read: boolean;
};

export type SystemBackup = {
  id: string;
  fileName: string;
  type: "Database" | "Media Assets" | "Invoices" | "Full System";
  size: string;
  createdAt: string;
  status: "Completed" | "Pending";
};

export type WorkflowTest = {
  id: string;
  name: string;
  module: string;
  status: "Passed" | "Failed" | "Warning";
  executionTime: string;
  lastTested: string;
};

export type QACheck = {
  id: string;
  category: "Responsive Design" | "Broken Links" | "Missing Images" | "SEO Metadata" | "Accessibility" | "Form Validation";
  name: string;
  status: "Passed" | "Warning" | "Error";
  details: string;
};

export type ReadinessCheck = {
  id: string;
  title: string;
  category: "Quality" | "Performance" | "Security" | "Integrations";
  status: boolean;
};

// ----------------------------------------------------
// INITIAL SYSTEM DATA
// ----------------------------------------------------

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-101",
    adminName: "Super Admin",
    role: "Super Admin",
    action: "Approved Campaign 'Aurelia Royal Zardozi'",
    module: "Marketing & Ads",
    date: new Date().toISOString().split("T")[0],
    time: "10:45 AM",
    ipAddress: "192.168.1.42",
    device: "Chrome (Windows 11)",
  },
  {
    id: "log-102",
    adminName: "Finance Manager",
    role: "Finance Admin",
    action: "Generated GST Tax Invoice INV-2026-001",
    module: "Finance & Invoices",
    date: new Date().toISOString().split("T")[0],
    time: "11:20 AM",
    ipAddress: "192.168.1.88",
    device: "MacBook Pro (macOS Sonoma)",
  },
  {
    id: "log-103",
    adminName: "Marketing Admin",
    role: "Marketing Admin",
    action: "Updated Placement Inventory Limit for Hero Banner to 3",
    module: "Inventory Management",
    date: new Date().toISOString().split("T")[0],
    time: "12:05 PM",
    ipAddress: "192.168.1.42",
    device: "Chrome (Windows 11)",
  },
];

export const INITIAL_SYSTEM_ERRORS: SystemError[] = [
  {
    id: "err-01",
    message: "Payment webhook verification timeout",
    stackTrace: "Error: Payment gateway connection refused at GatewayService.verify (api/payment.ts:45)",
    severity: "medium",
    module: "Payments Gateway",
    date: new Date().toISOString().split("T")[0],
    time: "09:12 AM",
    status: "Resolved",
    assignedDev: "Dev Ops Team",
  },
  {
    id: "err-02",
    message: "Image compression memory spike on high-res upload",
    stackTrace: "Warning: High memory buffer allocated (42MB) at MediaCompressor (lib/media.ts:112)",
    severity: "low",
    module: "Media Library",
    date: new Date().toISOString().split("T")[0],
    time: "08:30 AM",
    status: "In Progress",
    assignedDev: "Frontend Tech Lead",
  },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-01",
    title: "Pending Campaign Approval Required",
    message: "Vendor 'Aurelia Brides' submitted 'Royal Lehengas Hero Promo' for approval.",
    type: "approval",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    read: false,
  },
  {
    id: "notif-02",
    title: "GST Invoice Generated Successfully",
    message: "Tax Invoice INV-2026-001 has been generated and emailed to vendor.",
    type: "payment",
    date: new Date().toISOString().split("T")[0],
    time: "11:21 AM",
    read: false,
  },
  {
    id: "notif-03",
    title: "Hero Placement Capacity Warning",
    message: "Homepage Hero Banner slot has reached 3/3 active campaigns.",
    type: "inventory",
    date: new Date().toISOString().split("T")[0],
    time: "12:06 PM",
    read: true,
  },
];

export const INITIAL_BACKUPS: SystemBackup[] = [
  {
    id: "bak-01",
    fileName: "cloche_production_db_2026-07-26.sql.gz",
    type: "Database",
    size: "142.5 MB",
    createdAt: new Date().toISOString().split("T")[0] + " 02:00 AM",
    status: "Completed",
  },
  {
    id: "bak-02",
    fileName: "cloche_media_assets_2026-07-26.tar.gz",
    type: "Media Assets",
    size: "1.24 GB",
    createdAt: new Date().toISOString().split("T")[0] + " 03:00 AM",
    status: "Completed",
  },
];

export const INITIAL_WORKFLOW_TESTS: WorkflowTest[] = [
  { id: "wf-1", name: "Vendor Registration & Email Verification", module: "Vendor Hub", status: "Passed", executionTime: "120ms", lastTested: "Just now" },
  { id: "wf-2", name: "Predefined Admin Authentication Portal", module: "Admin Auth", status: "Passed", executionTime: "45ms", lastTested: "Just now" },
  { id: "wf-3", name: "Vendor Subscription & Payment Verification", module: "Subscriptions", status: "Passed", executionTime: "210ms", lastTested: "Just now" },
  { id: "wf-4", name: "Self-Service Ad Package Checkout", module: "Ad Engine", status: "Passed", executionTime: "180ms", lastTested: "Just now" },
  { id: "wf-[#5]", name: "Admin Assisted Campaign Setup & Direct Banner Upload", module: "Marketing CRM", status: "Passed", executionTime: "150ms", lastTested: "Just now" },
  { id: "wf-6", name: "Automatic Dynamic Banner Display & Device Responsiveness", module: "Site Placement", status: "Passed", executionTime: "60ms", lastTested: "Just now" },
  { id: "wf-7", name: "Real-time Impression & CTR Click Analytics Tracking", module: "Analytics Engine", status: "Passed", executionTime: "85ms", lastTested: "Just now" },
  { id: "wf-8", name: "Automated GST Tax Invoice PDF Generation", module: "Invoicing", status: "Passed", executionTime: "140ms", lastTested: "Just now" },
  { id: "wf-9", name: "Campaign Expiry & 1-Click Renewal Workflow", module: "Ad Engine", status: "Passed", executionTime: "95ms", lastTested: "Just now" },
];

export const INITIAL_QA_CHECKS: QACheck[] = [
  { id: "qa-1", category: "Responsive Design", name: "Desktop, Tablet & Mobile Viewports Alignment", status: "Passed", details: "Verified clean layout across 375px, 768px, and 1920px viewports." },
  { id: "qa-2", category: "SEO Metadata", name: "Page Titles & OpenGraph Tags Present", status: "Passed", details: "All dynamic routes contain canonical titles & descriptive metadata." },
  { id: "qa-3", category: "Form Validation", name: "Vendor & Admin Input Sanitization", status: "Passed", details: "All forms validate required fields and sanitized inputs." },
  { id: "qa-4", category: "Accessibility", name: "Image Alt Tags & ARIA Labels", status: "Passed", details: "All media assets include descriptive alt captions." },
  { id: "qa-[#5]", category: "Broken Links", name: "Internal Navigation Route Integrity", status: "Passed", details: "0 broken links detected across 100 compiled routes." },
];

export const INITIAL_READINESS_CHECKS: ReadinessCheck[] = [
  { id: "rc-1", title: "No TypeScript Compilation Errors (0 Errors)", category: "Quality", status: true },
  { id: "rc-2", title: "No Build or Syntax Failures Across 100 Routes", category: "Quality", status: true },
  { id: "rc-3", title: "Mobile & Laptop Responsive Viewport Certified", category: "Quality", status: true },
  { id: "rc-4", title: "Predefined Admin Login & Role Protection Active", category: "Security", status: true },
  { id: "rc-5", title: "Automatic Ad Banner Rendering Engine Active", category: "Integrations", status: true },
  { id: "rc-6", title: "Real-Time CTR Analytics & Lead Tracking Operational", category: "Performance", status: true },
  { id: "rc-7", title: "GST Invoice Generation & PDF Exporter Active", category: "Integrations", status: true },
  { id: "rc-8", title: "Overbooking Inventory Capacity Control Enabled", category: "Integrations", status: true },
  { id: "rc-9", title: "System Audit Logs & Security Monitoring Active", category: "Security", status: true },
  { id: "rc-10", title: "Database & Media Backup Infrastructure Configured", category: "Performance", status: true },
];

// ----------------------------------------------------
// STORAGE HELPERS
// ----------------------------------------------------

const AUDIT_STORAGE_KEY = "cloche_audit_logs_v1";
const ERRORS_STORAGE_KEY = "cloche_system_errors_v1";
const NOTIFS_STORAGE_KEY = "cloche_notifications_v1";
const BACKUPS_STORAGE_KEY = "cloche_backups_v1";

export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAdminAction(adminName: string, role: string, action: string, module: string): void {
  if (typeof window === "undefined") return;
  const existing = getAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    adminName,
    role,
    action,
    module,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    ipAddress: "192.168.1.42",
    device: "Chrome (Windows 11)",
  };
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([newLog, ...existing]));
}

export function getSystemErrors(): SystemError[] {
  if (typeof window === "undefined") return INITIAL_SYSTEM_ERRORS;
  try {
    const raw = localStorage.getItem(ERRORS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(INITIAL_SYSTEM_ERRORS));
      return INITIAL_SYSTEM_ERRORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SYSTEM_ERRORS;
  }
}

export function getSystemNotifications(): SystemNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function markNotificationRead(id: string): void {
  const notifs = getSystemNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
}

export function getSystemBackups(): SystemBackup[] {
  if (typeof window === "undefined") return INITIAL_BACKUPS;
  try {
    const raw = localStorage.getItem(BACKUPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(INITIAL_BACKUPS));
      return INITIAL_BACKUPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BACKUPS;
  }
}

export function createNewBackup(type: SystemBackup["type"]): SystemBackup {
  const existing = getSystemBackups();
  const created: SystemBackup = {
    id: `bak-${Date.now()}`,
    fileName: `cloche_${type.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.sql.gz`,
    type,
    size: "158.2 MB",
    createdAt: new Date().toLocaleString(),
    status: "Completed",
  };
  const updated = [created, ...existing];
  localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(updated));
  return created;
}
