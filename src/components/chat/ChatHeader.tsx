import { Bot, Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClearChat: () => void;
  hasMessages: boolean;
}

/**
 * ChatHeader - Top header with app name, theme toggle, and clear chat
 */
const ChatHeader = ({ onClearChat, hasMessages }: ChatHeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[hsl(var(--chat-header-bg))] border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Left: Logo and title */}
        <div className="flex items-center gap-3">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          {hasMessages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearChat}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
