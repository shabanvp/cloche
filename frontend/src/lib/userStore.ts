import { getCurrentUser } from "@/app/actions/auth";

export function getStoredUserName(): string {
  if (typeof window === "undefined") return "";

  const userName = localStorage.getItem("userName");
  if (userName && userName.trim() && userName !== "Cloche User" && userName !== "User") {
    return userName.trim();
  }

  const name = localStorage.getItem("name");
  if (name && name.trim() && name !== "Cloche User" && name !== "User") {
    return name.trim();
  }

  const ownerName = localStorage.getItem("ownerName");
  if (ownerName && ownerName.trim() && ownerName !== "Cloche User" && ownerName !== "User") {
    return ownerName.trim();
  }

  const userNameUnderscore = localStorage.getItem("user_name");
  if (userNameUnderscore && userNameUnderscore.trim() && userNameUnderscore !== "Cloche User" && userNameUnderscore !== "User") {
    return userNameUnderscore.trim();
  }

  const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email");
  if (userEmail && userEmail.includes("@")) {
    const part = userEmail.split("@")[0].trim();
    if (part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
  }

  return "";
}

export function resolveUserDisplayName(userObj?: any): string {
  if (userObj) {
    const full = userObj.full_name || userObj.fullName || userObj.name || userObj.owner_name || userObj.ownerName;
    if (full && typeof full === "string" && full.trim() && full !== "Cloche User" && full !== "User") {
      return full.trim();
    }

    const first = userObj.first_name || userObj.firstName;
    if (first && typeof first === "string" && first.trim()) {
      return first.trim();
    }

    const username = userObj.username || userObj.userName;
    if (username && typeof username === "string" && username.trim()) {
      return username.trim();
    }

    if (userObj.email && typeof userObj.email === "string" && userObj.email.includes("@")) {
      const emailName = userObj.email.split("@")[0];
      if (emailName) return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
  }

  const local = getStoredUserName();
  if (local) return local;

  return "User";
}

export async function fetchAuthenticatedUser(): Promise<string> {
  try {
    const res = await getCurrentUser();
    if (res?.success && res.user) {
      const resolved = resolveUserDisplayName(res.user);
      if (resolved && resolved !== "User" && typeof window !== "undefined") {
        localStorage.setItem("userName", resolved);
      }
      return resolved;
    }
  } catch (e) {
    console.error("fetchAuthenticatedUser error", e);
  }

  return resolveUserDisplayName();
}

export function clearUserSessionCache(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("user_name");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
  }
}
