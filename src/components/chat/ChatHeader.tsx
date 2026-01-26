import { Bot } from "lucide-react";

/**
 * ChatHeader - Top header displaying app name
 */
const ChatHeader = () => {
  return (
    <header className="bg-[hsl(var(--chat-header-bg))] border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">AI Chat</h1>
          <p className="text-xs text-muted-foreground">
            Your intelligent assistant
          </p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
