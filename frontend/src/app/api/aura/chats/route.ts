import { NextResponse } from "next/server";
import { auraDbFetch, getAuraIdentity, safeChatId } from "@/lib/auraServer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to access your Aura chats." }, { status: 401 });

  try {
    const chats = await auraDbFetch<any[]>(
      `aura_conversations?user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned,updated_at,context,created_at&order=pinned.desc,updated_at.desc&limit=100`
    );
    if (!Array.isArray(chats) || chats.length === 0) return NextResponse.json({ chats: [] });

    const ids = chats.map((chat) => chat.id);
    const messages = await auraDbFetch<any[]>(
      `aura_messages?user_id=eq.${encodeURIComponent(identity.userId)}&conversation_id=in.(${ids.map(encodeURIComponent).join(",")})&select=id,conversation_id,client_message_id,role,content,metadata,created_at&order=created_at.asc&limit=5000`
    );
    const byChat = new Map<string, any[]>();
    for (const message of messages || []) {
      const list = byChat.get(message.conversation_id) || [];
      list.push(message);
      byChat.set(message.conversation_id, list);
    }
    return NextResponse.json({ chats: chats.map((chat) => ({ ...chat, messages: byChat.get(chat.id) || [] })) });
  } catch (error) {
    console.error("[Aura chats] Unable to restore conversations", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Aura chat history is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to manage your Aura chats." }, { status: 401 });

  try {
    let body: any = {};
    try { body = await request.json(); } catch {}
    const id = safeChatId(body?.id) ? body.id : `chat-${Date.now()}`;
    const title = typeof body?.title === "string" && body.title.trim() ? body.title.trim().slice(0, 80) : "New chat";
    const context = body?.context && typeof body.context === "object" ? body.context : {};

    await auraDbFetch("aura_conversations", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({
        id,
        user_id: identity.userId,
        title,
        pinned: false,
        context,
      }),
    });

    return NextResponse.json({
      success: true,
      chat: {
        id,
        title,
        pinned: false,
        updated_at: new Date().toISOString(),
        messages: [],
      },
    }, { status: 201 });
  } catch (error) {
    console.error("[Aura chats] Unable to create conversation", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not create new conversation." }, { status: 503 });
  }
}
