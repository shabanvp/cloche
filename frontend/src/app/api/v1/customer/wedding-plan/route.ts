import { NextResponse } from "next/server";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";
import { supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    // 1. Fetch user preferences / wedding plan
    const { data: prefRows } = await supabaseFetch(
      `user_preferences?user_id=eq.${encodeURIComponent(authUser.userId)}&select=*`
    );

    const userPref = Array.isArray(prefRows) && prefRows.length > 0 ? prefRows[0] : null;

    // 2. Fetch user profile defaults
    const { data: userRows } = await supabaseFetch(
      `users?id=eq.${encodeURIComponent(authUser.userId)}&select=id,full_name`
    );
    const userRow = Array.isArray(userRows) && userRows.length > 0 ? userRows[0] : null;

    let parsedStylePrefs: Record<string, any> = {};
    if (userPref?.style_preferences) {
      if (Array.isArray(userPref.style_preferences) && userPref.style_preferences.length > 0) {
        try {
          parsedStylePrefs = JSON.parse(userPref.style_preferences[0]);
        } catch (e) {}
      } else if (typeof userPref.style_preferences === "string") {
        try {
          parsedStylePrefs = JSON.parse(userPref.style_preferences);
        } catch (e) {}
      } else {
        parsedStylePrefs = userPref.style_preferences;
      }
    }

    const weddingPlan = {
      userId: authUser.userId,
      estimatedBudget: Number(userPref?.estimated_budget || parsedStylePrefs?.estimatedBudget || 1500000),
      guestCount: Number(userPref?.guest_count || parsedStylePrefs?.guestCount || 400),
      preferredCity: userPref?.preferred_city || "Thrissur",
      weddingDate: userPref?.wedding_date || "",
      budgetBreakdown: parsedStylePrefs?.budgetBreakdown || [
        { category: "Venue & Accommodation", percentage: 40, amount: 600000, note: "Main banquet hall / lawn & guest stay" },
        { category: "Catering & Sadya", percentage: 25, amount: 375000, note: "Traditional banana leaf Sadya & live counters" },
        { category: "Photography & Video", percentage: 12, amount: 180000, note: "Candid photography, cinematography & teaser" },
        { category: "Decor & Stage Styling", percentage: 10, amount: 150000, note: "Stage, entrance arch, mandap & floral styling" },
        { category: "Bridal Attire & Makeup", percentage: 8, amount: 120000, note: "Bridal couture, jewelry accessories & MUA" },
        { category: "Logistics & Contingency", percentage: 5, amount: 75000, note: "Transport, sound, invitations & contingency" },
      ],
      checklist: parsedStylePrefs?.checklist || [
        { id: "chk-1", title: "Finalize wedding dates & auspicious Muhurtham", category: "Planning", completed: false },
        { id: "chk-2", title: "Select and book wedding venue", category: "Venue", completed: false },
        { id: "chk-3", title: "Book authentic Kerala wedding caterer for Sadya", category: "Catering", completed: false },
        { id: "chk-4", title: "Hire candid wedding photographer & cinematographer", category: "Photography", completed: false },
        { id: "chk-5", title: "Select bridal silk saree / lehenga & jewelry", category: "Attire", completed: false },
        { id: "chk-6", title: "Book bridal makeup artist & mehendi designer", category: "Beauty", completed: false },
        { id: "chk-7", title: "Design and send digital wedding invitations", category: "Invitations", completed: false },
      ],
      updatedAt: userPref?.updated_at || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: weddingPlan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { estimatedBudget, guestCount, preferredCity, weddingDate, budgetBreakdown, checklist } = body;

    const { data: existingPrefs } = await supabaseFetch(
      `user_preferences?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id,style_preferences`
    );

    let currentStyle: Record<string, any> = {};
    if (Array.isArray(existingPrefs) && existingPrefs.length > 0 && existingPrefs[0].style_preferences) {
      currentStyle = typeof existingPrefs[0].style_preferences === "string" 
        ? JSON.parse(existingPrefs[0].style_preferences) 
        : existingPrefs[0].style_preferences;
    }

    if (budgetBreakdown !== undefined) currentStyle.budgetBreakdown = budgetBreakdown;
    if (checklist !== undefined) currentStyle.checklist = checklist;
    if (estimatedBudget !== undefined) currentStyle.estimatedBudget = Number(estimatedBudget);
    if (guestCount !== undefined) currentStyle.guestCount = Number(guestCount);
    if (preferredCity !== undefined) currentStyle.preferredCity = String(preferredCity);

    const payload: Record<string, any> = {
      user_id: authUser.userId,
      estimated_budget: estimatedBudget !== undefined ? Number(estimatedBudget) : undefined,
      guest_count: guestCount !== undefined ? Number(guestCount) : undefined,
      preferred_city: preferredCity !== undefined ? String(preferredCity) : undefined,
      wedding_date: weddingDate !== undefined ? weddingDate : undefined,
      style_preferences: [JSON.stringify(currentStyle)],
      updated_at: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    let res;
    if (Array.isArray(existingPrefs) && existingPrefs.length > 0) {
      res = await supabaseFetch(`user_preferences?id=eq.${encodeURIComponent(existingPrefs[0].id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await supabaseFetch(`user_preferences`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
    }



    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Wedding plan saved successfully!",
      data: {
        userId: authUser.userId,
        estimatedBudget: payload.estimated_budget,
        guestCount: payload.guest_count,
        preferredCity: payload.preferred_city,
        weddingDate: payload.wedding_date,
        budgetBreakdown: currentStyle.budgetBreakdown,
        checklist: currentStyle.checklist,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
