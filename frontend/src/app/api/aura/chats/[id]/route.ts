import { NextResponse } from "next/server";
import { auraDbFetch, getAuraIdentity, safeChatId } from "@/lib/auraServer";

export const dynamic = "force-dynamic";

async function ownsChat(userId: string, id: string) {
  const rows = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}&select=id&limit=1`);
  return Array.isArray(rows) && rows.length > 0;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to manage Aura chats." }, { status: 401 });
  const { id } = await context.params;
  if (!safeChatId(id)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });

  try {
    const body = await request.json();
    if (typeof body.pinned !== "boolean") return NextResponse.json({ error: "Invalid chat update." }, { status: 400 });
    if (!(await ownsChat(identity.userId, id))) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ pinned: body.pinned, updated_at: new Date().toISOString() }),
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
