/**
 * TypingIndicator - Animated dots showing AI is processing
 */

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 animate-message-in">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Typing bubble */}
        <div className="bg-[hsl(var(--chat-assistant-bg))] rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="typing-dot w-2 h-2 bg-muted-foreground rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
