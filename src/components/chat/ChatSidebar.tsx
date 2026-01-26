import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/chatService";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

/**
 * ChatSidebar - Displays conversation history with navigation
 */
const ChatSidebar = ({
  conversations,
  activeConversationId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ChatSidebarProps) => {
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateLabel = formatDate(conv.updatedAt);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-0 md:w-14"
        )}
      >
        {/* Sidebar header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border shrink-0">
          {isOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
          >
            {isOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Conversation list */}
        {isOpen && (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-4">
              {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
                <div key={dateLabel}>
                  <p className="px-2 py-1 text-xs font-medium text-sidebar-foreground/60">
                    {dateLabel}
                  </p>
                  <div className="space-y-1">
                    {convs.map((conv) => (
                      <div
                        key={conv.id}
                        className={cn(
                          "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                          conv.id === activeConversationId
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        )}
                        onClick={() => onSelectConversation(conv.id)}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate text-sm">
                          {conv.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {conversations.length === 0 && (
                <div className="px-2 py-8 text-center text-sidebar-foreground/60 text-sm">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Collapsed state - just show new chat button */}
        {!isOpen && (
          <div className="flex-1 flex flex-col items-center pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ChatSidebar;
