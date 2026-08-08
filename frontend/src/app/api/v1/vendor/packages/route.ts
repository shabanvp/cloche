import { NextResponse } from "next/server";
import { fetchVendorPackagesFromDb, saveVendorPackageToDb, softDeleteVendorPackageFromDb } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data, error } = await fetchVendorPackagesFromDb(vendorId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const { category_id, service_id, name, tagline, description, price, discount_price, features, is_popular, is_active, status } = body;

    if (!name || price === undefined || price < 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Package name and non-negative price are required." } },
        { status: 400 }
      );
    }

    let parsedFeatures: string[] = [];
    if (Array.isArray(features)) {
      parsedFeatures = features.map((f) => f.toString().trim()).filter(Boolean);
    } else if (typeof features === "string") {
      parsedFeatures = features.split("\n").map((f) => f.trim()).filter(Boolean);
    }

    const resolvedVendorId = auth.vendorId;
    if (body.id && UUID_REGEX.test(body.id) && !(await vendorOwnsRecord("vendor_service_packages", body.id, resolvedVendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Package not found." } },
        { status: 404 }
      );
    }

    const payload: Record<string, any> = {
      vendor_id: resolvedVendorId,
      name: name.trim(),
      tagline: tagline ? tagline.trim() : null,
      description: description ? description.trim() : null,
      price: Number(price),
      discount_price: discount_price ? Number(discount_price) : null,
      features: parsedFeatures,
      is_popular: is_popular !== undefined ? Boolean(is_popular) : false,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      status: status ? status.toLowerCase() : "published",
      updated_at: new Date().toISOString(),
    };

    if (category_id && UUID_REGEX.test(category_id)) {
      payload.category_id = category_id;
    }
    if (service_id && UUID_REGEX.test(service_id)) {
      payload.service_id = service_id;
    }

    // ONLY set payload.id if body.id is a valid UUID (ignore p- fake IDs)
    if (body.id && UUID_REGEX.test(body.id)) {
      payload.id = body.id;
    }

    const { data, error } = await saveVendorPackageToDb(payload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const savedPkg = Array.isArray(data) ? data[0] : data;

    return NextResponse.json(
      { success: true, statusCode: payload.id ? 200 : 201, message: payload.id ? "Package updated successfully" : "Package created successfully", data: savedPkg },
      { status: payload.id ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Package ID parameter is required." } },
        { status: 400 }
      );
    }

    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { error } = await softDeleteVendorPackageFromDb(id, auth.vendorId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Package soft deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
