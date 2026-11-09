import { NextResponse } from "next/server";
import { auraDbFetch, getAuraIdentity, safeChatId } from "@/lib/auraServer";

export const dynamic = "force-dynamic";

async function ownsChat(userId: string, id: string) {
  const rows = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}&select=id&limit=1`);
  return Array.isArray(rows) && rows.length > 0;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to access Aura chats." }, { status: 401 });
  const { id } = await context.params;
  if (!safeChatId(id)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });

  try {
    const chats = await auraDbFetch<any[]>(
      `aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned,context,created_at,updated_at&limit=1`
    );
    if (!Array.isArray(chats) || chats.length === 0) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    const chat = chats[0];
    const messages = await auraDbFetch<any[]>(
      `aura_messages?conversation_id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,conversation_id,client_message_id,role,content,metadata,created_at&order=created_at.asc&limit=500`
    );
    return NextResponse.json({
      chat: {
        ...chat,
        messages: Array.isArray(messages) ? messages : [],
      },
    });
  } catch (error) {
    console.error("[Aura chats] Unable to retrieve conversation", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not load this chat." }, { status: 503 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to manage Aura chats." }, { status: 401 });
  const { id } = await context.params;
  if (!safeChatId(id)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });

  try {
    const body = await request.json();
    if (typeof body.pinned !== "boolean" && typeof body.title !== "string" && (!body.context || typeof body.context !== "object")) {
      return NextResponse.json({ error: "Invalid chat update parameters." }, { status: 400 });
    }
    if (!(await ownsChat(identity.userId, id))) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    const patchData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof body.pinned === "boolean") patchData.pinned = body.pinned;
    if (typeof body.title === "string" && body.title.trim()) patchData.title = body.title.trim().slice(0, 80);
    if (body.context && typeof body.context === "object") patchData.context = body.context;

    await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patchData),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Aura chats] Unable to update conversation", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not update this chat." }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to manage Aura chats." }, { status: 401 });
  const { id } = await context.params;
  if (!safeChatId(id)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });

  try {
    if (!(await ownsChat(identity.userId, id))) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Aura chats] Unable to delete conversation", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not delete this chat." }, { status: 503 });
  }
}
