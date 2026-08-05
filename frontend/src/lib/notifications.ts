import { getSupabaseConfig } from "./supabase";
import { sendVerificationMail } from "./email";

export type NotificationEventType =
  | "LEAD_CREATED"
  | "LEAD_ASSIGNED"
  | "LEAD_STATUS_CHANGED"
  | "QUOTE_SENT"
  | "QUOTE_ACCEPTED"
  | "QUOTE_REJECTED"
  | "BOOKING_CONFIRMED";

export interface NotificationEventPayload {
  eventType: NotificationEventType;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientId?: string;
  data: Record<string, any>;
}

// -----------------[# PROVIDER ADAPTER INTERFACES #]-----------------

export interface NotificationProvider {
  name: string;
  send(event: NotificationEventPayload): Promise<{ success: boolean; message?: string }>;
}

export class EmailNotificationProvider implements NotificationProvider {
  name = "EmailProvider (Brevo Transactional)";

  async send(event: NotificationEventPayload): Promise<{ success: boolean; message?: string }> {
    const { recipientEmail, eventType, data } = event;
    if (!recipientEmail) return { success: false, message: "No recipient email specified." };

    console.log(`[NOTIFICATION_SERVICE] [${this.name}] Dispatching ${eventType} to ${recipientEmail}...`);

    try {
      if (eventType === "LEAD_CREATED" || eventType === "QUOTE_SENT") {
        // Send email via Brevo sender service
        await sendVerificationMail({
          email: recipientEmail,
          name: data.customerName || data.vendorName || "Valued User",
          verificationToken: "N/A",
          role: data.role || "customer",
        }).catch(() => null);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}

export class InAppNotificationProvider implements NotificationProvider {
  name = "InAppNotificationProvider";

  async send(event: NotificationEventPayload): Promise<{ success: boolean; message?: string }> {
    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;
    if (!url || !apiKey || !event.recipientId) return { success: true };

    try {
      await fetch(`${url}/rest/v1/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          user_id: event.recipientId,
          type: event.eventType,
          title: `New Notification: ${event.eventType.replace("_", " ")}`,
          message: event.data.message || `You have a new update regarding ${event.eventType.toLowerCase()}.`,
          created_at: new Date().toISOString(),
        }),
      }).catch(() => null);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}

// -----------------[# CENTRALIZED NOTIFICATION SERVICE #]-----------------

export class NotificationService {
  private providers: NotificationProvider[] = [
    new EmailNotificationProvider(),
    new InAppNotificationProvider(),
  ];

  /**
   * Enqueues notification event into notification_queue table for async execution
   */
  async enqueueEvent(payload: NotificationEventPayload): Promise<{ success: boolean; queueId?: string }> {
    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      // Fallback: execute in-memory asynchronously
      this.processEventAsynchronously(payload);
      return { success: true };
    }

    try {
      const res = await fetch(`${url}/rest/v1/notification_queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: "return=representation" },
        body: JSON.stringify({
          event_type: payload.eventType,
          recipient_email: payload.recipientEmail || null,
          recipient_phone: payload.recipientPhone || null,
          recipient_id: payload.recipientId || null,
          payload: payload.data,
          status: "pending",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const queueId = Array.isArray(data) ? data[0]?.id : data?.id;
        // Trigger background processing
        this.processEventAsynchronously(payload, queueId);
        return { success: true, queueId };
      } else {
        this.processEventAsynchronously(payload);
        return { success: true };
      }
    } catch (err) {
      this.processEventAsynchronously(payload);
      return { success: true };
    }
  }

  private async processEventAsynchronously(payload: NotificationEventPayload, queueId?: string) {
    setImmediate(async () => {
      try {
        for (const provider of this.providers) {
          await provider.send(payload).catch((err) => {
            console.warn(`[NOTIFICATION_SERVICE] Provider ${provider.name} error:`, err);
          });
        }

        if (queueId) {
          const { url, serviceKey, anonKey } = getSupabaseConfig();
          const apiKey = serviceKey || anonKey;
          if (url && apiKey) {
            await fetch(`${url}/rest/v1/notification_queue?id=eq.${encodeURIComponent(queueId)}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", apikey: apiKey, Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({ status: "completed", processed_at: new Date().toISOString() }),
            }).catch(() => null);
          }
        }
      } catch (e) {
        console.error("[NOTIFICATION_SERVICE] Async queue processing error:", e);
      }
    });
  }
}

export const notificationService = new NotificationService();
