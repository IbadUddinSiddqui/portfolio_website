import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "./message-actions";

export const dynamic = "force-dynamic";

async function getMessages() {
  return db.message.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  });
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Messages</h1>
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
            : "No unread messages"}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No messages yet. Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl border p-5 transition-colors ${
                !message.read
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {message.name}
                    </span>
                    {!message.read && (
                      <Badge className="text-xs bg-primary text-primary-foreground">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.email}
                    {message.subject && (
                      <>
                        <span className="mx-1.5">·</span>
                        {message.subject}
                      </>
                    )}
                    <span className="mx-1.5">·</span>
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <MessageActions
                  messageId={message.id}
                  read={message.read}
                  email={message.email}
                />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </FadeIn>
  );
}
