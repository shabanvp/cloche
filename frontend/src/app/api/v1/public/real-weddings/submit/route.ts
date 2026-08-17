import { NextResponse } from "next/server";
import { createStorySubmission, StorySubmissionPayload } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      couple_names,
      city,
      wedding_date,
      style,
      cover_image_url,
      gallery,
      story_text,
      short_story,
      vendor_credits,
      submitted_by,
      submitter_name,
      submitter_email,
    } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "A descriptive wedding story title is required." },
        },
        { status: 400 }
      );
    }

    if (!cover_image_url || typeof cover_image_url !== "string" || !cover_image_url.startsWith("http")) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "A valid cover image is required." },
        },
        { status: 400 }
      );
    }

    if (!story_text || typeof story_text !== "string" || story_text.trim().length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Please provide a wedding story narrative (minimum 20 characters)." },
        },
        { status: 400 }
      );
    }

    // Clean vendor credits
    const cleanedCredits = Array.isArray(vendor_credits)
      ? vendor_credits
          .filter((v) => v && typeof v === "object" && v.vendor_id && v.role)
          .map((v) => ({
            vendor_id: String(v.vendor_id),
            role: String(v.role),
            business_name: v.business_name ? String(v.business_name) : undefined,
            slug: v.slug ? String(v.slug) : undefined,
            category: v.category ? String(v.category) : undefined,
          }))
      : [];

    const payload: StorySubmissionPayload = {
      title: title.trim(),
      couple_names: couple_names ? String(couple_names).trim() : undefined,
      city: city ? String(city).trim() : undefined,
      wedding_date: wedding_date ? String(wedding_date).trim() : undefined,
      style: style ? String(style).trim() : "Traditional Kerala",
      cover_image_url: cover_image_url.trim(),
      gallery: Array.isArray(gallery) ? gallery : [],
      story_text: story_text.trim(),
      short_story: short_story ? String(short_story).trim() : undefined,
      vendor_credits: cleanedCredits,
      submitted_by: submitted_by ? String(submitted_by) : undefined,
      submitter_name: submitter_name ? String(submitter_name).trim() : undefined,
      submitter_email: submitter_email ? String(submitter_email).trim() : undefined,
    };

    const newStory = await createStorySubmission(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Thanks! Our editorial team will review your story before it's published.",
        story: {
          id: newStory.id,
          slug: newStory.slug,
          status: newStory.status,
          title: newStory.title,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/v1/public/real-weddings/submit] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: err?.message || "Failed to submit wedding story." },
      },
      { status: 500 }
    );
  }
}
