import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  getMehendiAnalytics,
  getMehendiProfile,
  listMehendiAppointments,
  listMehendiCollections,
  listMehendiPortfolio,
  listMehendiReviews,
  listMehendiServices,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const [profile, services, portfolio, collections, appointments, reviews, analytics] =
      await Promise.all([
        getMehendiProfile(context.vendorId, context),
        listMehendiServices(context.vendorId),
        listMehendiPortfolio(context.vendorId),
        listMehendiCollections(context.vendorId),
        listMehendiAppointments(context.vendorId),
        listMehendiReviews(context.vendorId),
        getMehendiAnalytics(context.vendorId, "30d"),
      ]);

    const activeServices = services.filter((s) => s.isActive);
    const pendingAppointments = appointments.filter((a) => a.status === "pending");

    return NextResponse.json({
      success: true,
      data: {
        vendorId: context.vendorId,
        businessName: profile.businessName,
        ownerName: profile.ownerName,
        slug: profile.slug,
        publicationStatus: profile.publicationStatus,
        profileCompletionPercentage: profile.profileCompletionPercentage,
        logoUrl: profile.businessLogoUrl,
        coverUrl: profile.coverPhotoUrl,
        metrics: {
          totalProfileViews: analytics.totalProfileViews,
          totalDesigns: portfolio.length,
          activeServices: activeServices.length,
          totalEnquiries: appointments.length,
          appointmentRequests: pendingAppointments.length,
          averageCustomerRating: reviews.averageRating || profile.rating,
          totalReviews: reviews.totalReviews,
          confirmedAppointments: analytics.confirmedAppointments,
        },
        recentEnquiries: appointments.slice(0, 5),
        popularDesigns: analytics.popularDesigns,
        recentReviews: reviews.reviews.slice(0, 4),
        trafficSeries: analytics.trafficSeries,
      },
    });
  } catch (err: any) {
    console.error("[MEHENDI_OVERVIEW_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load Mehendi overview." },
      { status: 500 }
    );
  }
}

