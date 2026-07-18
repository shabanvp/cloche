"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function getAppointments() {
  const token = await getAuthToken();
  if (!token) return { success: false, data: [] };

  try {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    });
    return await res.json();
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function createAppointment(data: { boutique_id: number; appointment_date: string; appointment_time: string; notes?: string }) {
  const token = await getAuthToken();
  if (!token) return { success: false, message: "Please login to book an appointment" };

  try {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}

export async function updateAppointmentStatus(id: number, status: string, newDate?: string, newTime?: string) {
  const token = await getAuthToken();
  if (!token) return { success: false };

  const updateData: any = { status };
  if (newDate) updateData.appointment_date = newDate;
  if (newTime) updateData.appointment_time = newTime;

  try {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function deleteAppointment(id: number) {
  const token = await getAuthToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}
