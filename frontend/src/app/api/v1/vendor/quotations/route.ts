import { NextResponse } from "next/server";
import {
  fetchVendorQuotationsFromDb,
  saveQuotationToDb,
  saveQuotationItemsToDb,
  updateLeadStatusInDb,
  saveLeadActivityToDb,
} from "@/lib/supabase";
import { notificationService } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor_id") || "v-demo-vendor";

    const { data, error } = await fetchVendorQuotationsFromDb(vendorId);

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
  const logPrefix = "[QUOTATION_API]";

  try {
    const body = await req.json();
    const {
      lead_id,
      vendor_id,
      quotation_number,
      revision_number,
      subtotal,
      discount_amount,
      tax_rate,
      terms_and_conditions,
      cover_letter,
      payment_terms,
      valid_until,
      items,
    } = body;

    if (!lead_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Lead ID and at least 1 itemized line item are required." } },
        { status: 400 }
      );
    }

    const calcSubtotal = Number(subtotal) || items.reduce((acc, item) => acc + (Number(item.quantity || 1) * Number(item.unit_price || 0)), 0);
    const calcDiscount = Number(discount_amount || 0);
    const afterDiscount = Math.max(0, calcSubtotal - calcDiscount);
    const calcTaxRate = Number(tax_rate !== undefined ? tax_rate : 18);
    const calcTaxAmount = (afterDiscount * calcTaxRate) / 100;
    const calcFinalAmount = afterDiscount + calcTaxAmount;

    const autoQuoteNum = quotation_number || `QTN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const revNum = revision_number ? Number(revision_number) : 1;

    const payload = {
      lead_id,
      vendor_id: vendor_id || "v-demo-vendor",
      quotation_number: `${autoQuoteNum}-R${revNum}`,
      revision_number: revNum,
      subtotal: calcSubtotal,
      discount_amount: calcDiscount,
      tax_rate: calcTaxRate,
      tax_amount: calcTaxAmount,
      final_amount: calcFinalAmount,
      terms_and_conditions: terms_and_conditions || "Standard 50% advance booking deposit required. Remaining balance due 7 days before event date.",
      cover_letter: cover_letter || "Thank you for choosing Cloche Luxury. We are delighted to present our formal proposal for your upcoming event.",
      payment_terms: payment_terms || "50% Advance Deposit | 50% Final Settlement",
      valid_until: valid_until || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "sent",
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`${logPrefix} Saving quotation ${payload.quotation_number}...`);
    const { data: qData, error: qError } = await saveQuotationToDb(payload);

    if (qError) {
      console.error(`${logPrefix} Quotation db error:`, qError);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: qError.message } },
        { status: 500 }
      );
    }

    const savedQuotation = Array.isArray(qData) ? qData[0] : qData;

    // Save Itemized Line Items with Complete Frozen Snapshots
    if (savedQuotation?.id) {
      const lineItemRecords = items.map((item: any, idx: number) => ({
        quotation_id: savedQuotation.id,
        service_id: item.service_id || null,
        package_id: item.package_id || null,
        catalog_item_id: item.catalog_item_id || null,
        item_name: item.item_name || item.name || "Custom Service Item",
        description: item.description || null,
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.unit_price || 0),
        total_price: Number(item.quantity || 1) * Number(item.unit_price || 0),
        sort_order: idx,
        item_snapshot: {
          item_name: item.item_name || item.name || "Custom Service Item",
          description: item.description || null,
          unit_price: Number(item.unit_price || 0),
          quantity: Number(item.quantity || 1),
          specs: item.specs || item.features || [],
          service: item.service || null,
          package: item.package || null,
          quoted_at: new Date().toISOString(),
        },
      }));

      await saveQuotationItemsToDb(lineItemRecords).catch(() => null);

      // Auto Update Lead Status to 'quotation_sent'
      await updateLeadStatusInDb(lead_id, "quotation_sent").catch(() => null);

      // Automatically Log Activity Timeline
      await saveLeadActivityToDb(
        lead_id,
        "quotation_sent",
        `Quotation ${savedQuotation.quotation_number} (Final Total: ₹${calcFinalAmount.toLocaleString("en-IN")}) sent to customer.`
      ).catch(() => null);

      // Dispatch QUOTE_SENT Notification Event via NotificationService
      await notificationService.enqueueEvent({
        eventType: "QUOTE_SENT",
        data: {
          quotationId: savedQuotation.id,
          quotationNumber: savedQuotation.quotation_number,
          leadId: lead_id,
          finalAmount: calcFinalAmount,
        },
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Quotation created and sent successfully!",
        data: savedQuotation,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} Unhandled error:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
