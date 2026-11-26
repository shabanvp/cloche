import { NextResponse } from "next/server";
import { getSupabaseConfig, fetchVendorCatalogFromDb, saveVendorCatalogItemToDb, softDeleteVendorCatalogItemFromDb } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data, error } = await fetchVendorCatalogFromDb(vendorId);

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
    const { category_id, category, title, description, image_url, price, price_unit, sku, stock_quantity, is_available, status, images } = body;

    if (!title || price === undefined || price < 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Catalog item title and valid non-negative price are required." } },
        { status: 400 }
      );
    }

    if (body.id && !(await vendorOwnsRecord("vendor_catalog_items", body.id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Catalog item not found." } },
        { status: 404 }
      );
    }

    const payload: Record<string, any> = {
      vendor_id: auth.vendorId,
      category_id: category_id || null,
      category: category ? category.trim() : null,
      title: title.trim(),
      description: description ? description.trim() : null,
      image_url: image_url || null,
      price: Number(price),
      price_unit: price_unit || "item",
      sku: sku ? sku.trim() : `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      stock_quantity: stock_quantity !== undefined ? Number(stock_quantity) : 1,
      is_available: is_available !== undefined ? Boolean(is_available) : true,
      status: status || "published",
      updated_at: new Date().toISOString(),
    };

    if (body.id) {
      payload.id = body.id;
    }

    const { data, error } = await saveVendorCatalogItemToDb(payload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const savedItem = Array.isArray(data) ? data[0] : data;

    // Save image gallery if provided
    if (Array.isArray(images) && images.length > 0 && savedItem?.id) {
      const { url, serviceKey, anonKey } = getSupabaseConfig();
      const apiKey = serviceKey;
      if (url && apiKey) {
        for (let i = 0; i < images.length; i++) {
          const imgUrl = typeof images[i] === "string" ? images[i] : images[i].image_url;
          if (imgUrl) {
            await fetch(`${url}/rest/v1/vendor_catalog_images`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({
                catalog_item_id: savedItem.id,
                image_url: imgUrl,
                sort_order: i,
              }),
            }).catch(() => null);
          }
        }
      }
    }

    return NextResponse.json(
      { success: true, statusCode: body.id ? 200 : 201, message: body.id ? "Catalog item updated successfully" : "Catalog item created successfully", data: savedItem },
      { status: body.id ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Catalog item ID parameter is required." } },
        { status: 400 }
      );
    }

    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { error } = await softDeleteVendorCatalogItemFromDb(id, auth.vendorId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Catalog item soft deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
