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
        if (res.user.email) localStorage.setItem("userEmail", res.user.email);
      }
      return resolved;
    }
  } catch (e) {
    console.error("fetchAuthenticatedUser error", e);
  }

  return resolveUserDisplayName();
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  weddingDate: string;
}

export async function fetchAuthenticatedUserProfile(): Promise<UserProfileData | null> {
  try {
    const res = await getCurrentUser();
    if (res?.success && res.user) {
      const u = res.user;
      const profile: UserProfileData = {
        name: resolveUserDisplayName(u),
        email: u.email || "",
        phone: u.phone || "",
        city: u.city || "",
        weddingDate: u.weddingDate || u.wedding_date || "",
      };

      if (typeof window !== "undefined") {
        if (profile.name && profile.name !== "User") localStorage.setItem("userName", profile.name);
        if (profile.email) localStorage.setItem("userEmail", profile.email);
        if (profile.phone) localStorage.setItem("userPhone", profile.phone);
        if (profile.city) localStorage.setItem("userCity", profile.city);
        if (profile.weddingDate) localStorage.setItem("weddingDate", profile.weddingDate);
      }
      return profile;
    }
  } catch (e) {
    console.error("fetchAuthenticatedUserProfile error", e);
  }
  return null;
}

export function clearUserSessionCache(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("user_name");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userCity");
    localStorage.removeItem("weddingDate");
  }
}
