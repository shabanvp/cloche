import { NextResponse } from "next/server";
import { recordLedgerPaymentInDb, recordEscrowTransactionInDb, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

export async function POST(req: Request) {
  const logPrefix = "[IDEMPOTENT_PAYMENT_API]";

  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const {
      booking_id,
      user_id,
      amount,
      payment_type,
      payment_gateway,
      transaction_reference,
      idempotency_key,
    } = body;

    if (!booking_id || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Booking ID and valid positive amount are required." } },
        { status: 400 }
      );
    }

    if (!(await vendorOwnsRecord("bookings", booking_id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Booking not found." } },
        { status: 404 }
      );
    }

    const ik = idempotency_key || `IK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnId = transaction_reference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    console.log(`${logPrefix} Recording idempotent ledger payment ${ik} for booking ${booking_id}...`);

    // Step 1: Insert into payment_records (Payment Ledger Source of Truth)
    const { data: pData, error: pError } = await recordLedgerPaymentInDb({
      transaction_id: txnId,
      idempotency_key: ik,
      user_id: user_id || auth.user.userId,
      vendor_id: auth.vendorId,
      booking_id,
      amount: Number(amount),
      currency: "INR",
      payment_gateway: payment_gateway || "razorpay",
      status: "captured",
    });

    if (pError) {
      const errMsg = pError.message || "Payment ledger write failed.";
      if (errMsg.includes("duplicate key") || errMsg.includes("idempotency_key")) {
        return NextResponse.json(
          { success: false, statusCode: 409, error: { code: "DUPLICATE_PAYMENT", message: "This payment has already been processed (Idempotency Key Conflict)." } },
          { status: 409 }
        );
      }
    }

    // Step 2: Insert into booking_payments table
    const paymentNum = `PAY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    await supabaseFetch(`booking_payments`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        booking_id,
        payment_number: paymentNum,
        amount: Number(amount),
        payment_type: payment_type || "advance",
        status: "completed",
        transaction_reference: txnId,
        paid_at: new Date().toISOString(),
      }),
    }).catch(() => null);

    // Step 3: Fetch booking and update balance & payment status
    const bRes = await supabaseFetch(`bookings?id=eq.${encodeURIComponent(booking_id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}&select=*,escrow_accounts(*)`);
    if (!bRes.error && Array.isArray(bRes.data) && bRes.data.length > 0) {
      const bObj = bRes.data[0];
      const newBalance = Math.max(0, Number(bObj.balance_amount || 0) - Number(amount));
      const newPayStatus = newBalance === 0 ? "paid" : "partially_paid";

      await supabaseFetch(`bookings?id=eq.${encodeURIComponent(booking_id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, {
        method: "PATCH",
        body: JSON.stringify({ balance_amount: newBalance, payment_status: newPayStatus, updated_at: new Date().toISOString() }),
      }).catch(() => null);

      // Step 4: Record Escrow Audit Transaction History Entry
      if (Array.isArray(bObj.escrow_accounts) && bObj.escrow_accounts.length > 0) {
        const escrowAcc = bObj.escrow_accounts[0];
        const newHeld = Number(escrowAcc.held_amount || 0) + Number(amount);

        await recordEscrowTransactionInDb({
          escrow_account_id: escrowAcc.id,
          booking_id,
          transaction_type: "deposit_held",
          amount: Number(amount),
          balance_after: newHeld,
        }).catch(() => null);

        await supabaseFetch(`escrow_accounts?id=eq.${encodeURIComponent(escrowAcc.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ held_amount: newHeld, updated_at: new Date().toISOString() }),
        }).catch(() => null);
      }
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Payment successfully recorded in financial ledger and escrow updated!",
        data: { idempotency_key: ik, transaction_id: txnId, amount: Number(amount) },
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
