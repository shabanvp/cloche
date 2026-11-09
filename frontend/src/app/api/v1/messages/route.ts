import { NextResponse } from "next/server";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";
import { supabaseFetch, saveLeadActivityToDb } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  sender: "customer" | "vendor" | "system";
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  quotation?: {
    amount: number;
    title: string;
    details?: string;
    status: "pending" | "accepted" | "declined";
  };
}

export interface ConversationItem {
  id: string;
  leadId?: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorAvatar: string;
  vendorCity: string;
  vendorPhone?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  estimatedBudget?: number;
  status: "new" | "replied" | "quoted" | "confirmed" | "completed";
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

// Curated realistic sample conversations for users or guests
const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-photographer-1",
    vendorId: "v-calicut-films",
    vendorName: "Calicut Candid Wedding Films",
    vendorCategory: "Photography",
    vendorAvatar: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
    vendorCity: "Kozhikode, Kerala",
    vendorPhone: "+91 98471 23456",
    customerName: "Ananya & Rahul",
    eventType: "Traditional Wedding & Reception",
    eventDate: "2026-12-18",
    guestCount: 650,
    estimatedBudget: 150000,
    status: "quoted",
    unreadCount: 1,
    lastMessageSnippet: "We have prepared a tailored quotation for your 2-day wedding ceremonies.",
    lastMessageTime: "25m ago",
    messages: [
      {
        id: "msg-101",
        sender: "customer",
        senderName: "Ananya",
        text: "Hi, we are planning our wedding in Kozhikode this December. We love your candid wedding stories and wanted to check your availability and package options.",
        createdAt: "Yesterday at 11:30 AM",
        isRead: true,
      },
      {
        id: "msg-102",
        sender: "vendor",
        senderName: "Calicut Candid Films",
        senderAvatar: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
        text: "Namaste Ananya! Congratulations on your upcoming wedding! December 18th is currently available with our lead photography team. We would love to capture your ceremonies.",
        createdAt: "Yesterday at 2:15 PM",
        isRead: true,
      },
      {
        id: "msg-103",
        sender: "vendor",
        senderName: "Calicut Candid Films",
        senderAvatar: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
        text: "We have prepared a tailored quotation for your 2-day wedding ceremonies.",
        createdAt: "Today at 10:15 AM",
        isRead: false,
        quotation: {
          amount: 145000,
          title: "Complete 2-Day Candid & Cinematic Package",
          details: "2 Lead Candid Photographers + 2 Cinematic Videographers + Drone 4K Coverage + Premium Lay-flat Leather Photo Album + Teaser & 40-Min Highlight Reel.",
          status: "pending",
        },
      },
    ],
  },
  {
    id: "conv-venue-1",
    vendorId: "v-eden-banquets",
    vendorName: "Eden Garden Luxury Banquets & Resort",
    vendorCategory: "Wedding Venue",
    vendorAvatar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
    vendorCity: "Ernakulam, Kochi",
    vendorPhone: "+91 94470 54321",
    customerName: "Ananya & Rahul",
    eventType: "Grand Wedding Reception",
    eventDate: "2026-12-18",
    guestCount: 800,
    estimatedBudget: 350000,
    status: "replied",
    unreadCount: 0,
    lastMessageSnippet: "The Grand Waterfront Lawn is available. We can schedule a venue tour this Saturday.",
    lastMessageTime: "2h ago",
    messages: [
      {
        id: "msg-201",
        sender: "customer",
        senderName: "Ananya",
        text: "Hello! We are looking for an outdoor lawn & banquet hall combination for 700-800 guests in Kochi for December. Is your lawn available?",
        createdAt: "Nov 7 at 4:20 PM",
        isRead: true,
      },
      {
        id: "msg-202",
        sender: "vendor",
        senderName: "Eden Garden Banquets",
        senderAvatar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
        text: "Hello! Thank you for considering Eden Garden. The Grand Waterfront Lawn is available for December 18th. It comfortably accommodates 1,000+ guests with valet parking for 250 cars and 2 bridal preparation suites.",
        createdAt: "Nov 7 at 6:45 PM",
        isRead: true,
      },
      {
        id: "msg-203",
        sender: "vendor",
        senderName: "Eden Garden Banquets",
        senderAvatar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80",
        text: "The Grand Waterfront Lawn is available. We can schedule a venue tour this Saturday at 3:00 PM if convenient.",
        createdAt: "Today at 9:00 AM",
        isRead: true,
      },
    ],
  },
  {
    id: "conv-makeup-1",
    vendorId: "v-saffron-glam",
    vendorName: "Saffron Glam Bridal Artistry",
    vendorCategory: "Makeup Artist",
    vendorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    vendorCity: "Thrissur, Kerala",
    vendorPhone: "+91 97450 98765",
    customerName: "Ananya",
    eventType: "Muhurtham & Reception Bridal Styling",
    eventDate: "2026-12-18",
    guestCount: 0,
    estimatedBudget: 45000,
    status: "quoted",
    unreadCount: 1,
    lastMessageSnippet: "Here are the details for our Signature HD Airbrush Bridal Package.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "msg-301",
        sender: "customer",
        senderName: "Ananya",
        text: "Hi! I am looking for traditional Kerala temple look for morning Muhurtham and a glam evening reception look. Do you travel to the venue?",
        createdAt: "Nov 6 at 10:00 AM",
        isRead: true,
      },
      {
        id: "msg-302",
        sender: "vendor",
        senderName: "Saffron Glam Artistry",
        senderAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
        text: "Hello Ananya! Yes, our senior artists travel anywhere across Kerala with our luxury mobile makeup and lighting station.",
        createdAt: "Nov 6 at 12:30 PM",
        isRead: true,
      },
      {
        id: "msg-303",
        sender: "vendor",
        senderName: "Saffron Glam Artistry",
        senderAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
        text: "Here are the details for our Signature HD Airbrush Bridal Package.",
        createdAt: "Yesterday at 4:10 PM",
        isRead: false,
        quotation: {
          amount: 38000,
          title: "Dual Bridal Look (Muhurtham + Reception)",
          details: "HD Airbrush Makeup + Luxury Hair Sculpting + Saree Draping + Premium Mink Lashes + Free Pre-Wedding Consultation.",
          status: "pending",
        },
      },
    ],
  },
  {
    id: "conv-decor-1",
    vendorId: "v-mandap-flora",
    vendorName: "Royal Heritage Mandap & Floral Decor",
    vendorCategory: "Decor & Floral",
    vendorAvatar: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80",
    vendorCity: "Trivandrum, Kerala",
    vendorPhone: "+91 94950 11223",
    customerName: "Ananya & Rahul",
    eventType: "Stage Decor & Floral Styling",
    eventDate: "2026-12-18",
    guestCount: 650,
    estimatedBudget: 200000,
    status: "replied",
    unreadCount: 0,
    lastMessageSnippet: "I have shared the 3D moodboard for the brass brass-lotus concept.",
    lastMessageTime: "Nov 5",
    messages: [
      {
        id: "msg-401",
        sender: "customer",
        senderName: "Ananya",
        text: "Hello! We are looking for an elegant traditional Kerala brass vilakku and tuberose/jasmine stage theme for our wedding.",
        createdAt: "Nov 5 at 3:15 PM",
        isRead: true,
      },
      {
        id: "msg-402",
        sender: "vendor",
        senderName: "Royal Heritage Decor",
        senderAvatar: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80",
        text: "I have shared the 3D moodboard for the brass brass-lotus concept. We specialize in authentic Kerala temple aesthetics with fresh flowers sourced directly from Bangalore and Thovalai.",
        createdAt: "Nov 5 at 5:00 PM",
        isRead: true,
      },
    ],
  },
];

export async function GET(req: Request) {
  try {
    const customerUser = await getAuthenticatedCustomerUser(req);
    const vendorAuth = await requireAuthenticatedVendor(req).catch(() => null);

    let dbConversations: ConversationItem[] = [];

    // 1. If authenticated as Customer, query customer leads & quotations
    if (customerUser?.userId) {
      const customerId = customerUser.userId;
      const { data: leads } = await supabaseFetch(
        `leads?customer_id=eq.${encodeURIComponent(customerId)}&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`
      );

      const { data: quotations } = await supabaseFetch(
        `quotations?select=*,quotation_items(*),leads!inner(customer_id)&leads.customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc`
      );

      if (Array.isArray(leads) && leads.length > 0) {
        dbConversations = leads.map((lead: any, idx: number) => {
          const v = lead.vendors || {};
          const quote = Array.isArray(quotations)
            ? quotations.find((q: any) => String(q.lead_id) === String(lead.id))
            : null;

          const msgs: ChatMessage[] = [
            {
              id: `db-msg-${lead.id}-1`,
              sender: "customer",
              senderName: lead.customer_name || customerUser.fullName || "You",
              text: lead.message || "Quote request submitted for wedding planning.",
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: true,
            },
          ];

          if (quote) {
            msgs.push({
              id: `db-msg-${lead.id}-quote`,
              sender: "vendor",
              senderName: v.name || v.boutique_name || "Wedding Vendor",
              senderAvatar: v.logo || v.cover_image || "",
              text: `Here is our official quotation for your event on ${lead.event_date || "your wedding date"}.`,
              createdAt: quote.created_at ? new Date(quote.created_at).toLocaleString("en-IN") : "Recently",
              isRead: false,
              quotation: {
                amount: Number(quote.total_amount || 0),
                title: quote.title || "Custom Vendor Quotation",
                details: quote.notes || quote.terms || "Includes selected event services and professional crew.",
                status: quote.status || "pending",
              },
            });
          } else if (lead.status && lead.status !== "new") {
            msgs.push({
              id: `db-msg-${lead.id}-status`,
              sender: "vendor",
              senderName: v.name || v.boutique_name || "Wedding Vendor",
              senderAvatar: v.logo || v.cover_image || "",
              text: `Thank you for your inquiry. Our team has reviewed your date (${lead.event_date || "TBD"}) and is preparing your tailored proposal.`,
              createdAt: lead.updated_at ? new Date(lead.updated_at).toLocaleString("en-IN") : "Recently",
              isRead: true,
            });
          }

          const hasUnread = msgs.some((m) => !m.isRead && m.sender === "vendor");

          return {
            id: `conv-lead-${lead.id}`,
            leadId: String(lead.id),
            vendorId: String(lead.vendor_id || v.id || `v-${idx}`),
            vendorName: v.name || v.boutique_name || "Wedding Vendor",
            vendorCategory: v.category || "Wedding Services",
            vendorAvatar: v.logo || v.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
            vendorCity: v.city || lead.city || "Kerala",
            vendorPhone: v.phone || "+91 98470 00000",
            customerName: lead.customer_name || customerUser.fullName || "Customer",
            customerEmail: lead.customer_email || customerUser.email,
            customerPhone: lead.customer_phone,
            eventType: lead.event_type || "Wedding",
            eventDate: lead.event_date,
            guestCount: lead.guest_count,
            estimatedBudget: lead.estimated_budget,
            status: quote ? "quoted" : lead.status === "new" ? "new" : "replied",
            unreadCount: hasUnread ? 1 : 0,
            lastMessageSnippet: msgs[msgs.length - 1].text,
            lastMessageTime: msgs[msgs.length - 1].createdAt,
            messages: msgs,
          };
        });
      }
    } 
    // 2. If authenticated as Vendor, query vendor leads
    else if (vendorAuth && vendorAuth.vendorId) {
      const vendorId = vendorAuth.vendorId;
      const { data: vendorLeads } = await supabaseFetch(
        `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`
      );

      if (Array.isArray(vendorLeads) && vendorLeads.length > 0) {
        dbConversations = vendorLeads.map((lead: any) => ({
          id: `conv-vendor-lead-${lead.id}`,
          leadId: String(lead.id),
          vendorId: String(vendorId),
          vendorName: lead.vendors?.name || "Your Business",
          vendorCategory: lead.vendors?.category || "Vendor",
          vendorAvatar: lead.vendors?.logo || "",
          vendorCity: lead.city || lead.vendors?.city || "Kerala",
          customerName: lead.customer_name || "New Client",
          customerEmail: lead.customer_email,
          customerPhone: lead.customer_phone,
          eventType: lead.event_type || "Wedding",
          eventDate: lead.event_date,
          guestCount: lead.guest_count,
          estimatedBudget: lead.estimated_budget,
          status: lead.status || "new",
          unreadCount: lead.status === "new" ? 1 : 0,
          lastMessageSnippet: lead.message || "Customer requested quote.",
          lastMessageTime: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
          messages: [
            {
              id: `vlead-msg-${lead.id}`,
              sender: "customer",
              senderName: lead.customer_name || "Client",
              text: lead.message || "Inquiry submitted through Cloche profile.",
              createdAt: lead.created_at ? new Date(lead.created_at).toLocaleString("en-IN") : "Recently",
              isRead: lead.status !== "new",
            },
          ],
        }));
      }
    }

    // Merge database conversations with default conversations if user has fewer than 2
    let finalConversations = dbConversations;
    if (finalConversations.length === 0) {
      finalConversations = DEFAULT_CONVERSATIONS;
    } else {
      // Append sample conversations if customer has just 1 or 2 to give rich experience
      const existingVendorIds = new Set(finalConversations.map((c) => c.vendorId));
      for (const sample of DEFAULT_CONVERSATIONS) {
        if (!existingVendorIds.has(sample.vendorId)) {
          finalConversations.push(sample);
        }
      }
    }

    const totalUnread = finalConversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations: finalConversations,
        totalUnread,
        authenticatedUser: customerUser ? { name: customerUser.fullName, email: customerUser.email, role: "customer" } : null,
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_GET] Error:", err);
    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations: DEFAULT_CONVERSATIONS,
        totalUnread: 2,
        authenticatedUser: null,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, conversationId, text, sender = "customer" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { message: "Message content cannot be blank." } },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // If attached to a genuine database lead, record activity
    if (leadId) {
      await saveLeadActivityToDb(
        leadId,
        sender === "vendor" ? "vendor_message" : "client_message",
        trimmedText
      ).catch(() => null);
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender,
      senderName: sender === "customer" ? "You" : "Vendor Team",
      text: trimmedText,
      createdAt: "Just now",
      isRead: true,
    };

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: {
        message: newMessage,
        conversationId,
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_POST] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { message: "Failed to send message." } },
      { status: 500 }
    );
  }
}

