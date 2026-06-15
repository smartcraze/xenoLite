"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/lib/constants";

export function CopilotChat({ token }: { token: string }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${APP_CONFIG.API_URL}/agents/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    onError: (error) => {
      toast.error("Failed to communicate with AI Copilot");
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input?.trim() && !isLoading) {
        sendMessage({ text: input });
        setInput("");
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] border-border/50 bg-card overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center space-y-4">
            <Bot className="h-12 w-12 text-primary/50 animate-bounce" />
            <div>
              <p className="font-medium text-foreground text-lg">Welcome to AI Copilot</p>
              <p className="text-sm max-w-sm mx-auto mt-1">
                I can help you segment audiences, draft marketing campaigns, and analyze performance. How can I assist you today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <div
                className={`flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                {m.parts?.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <div key={index} className="whitespace-pre-wrap">
                        {part.text}
                      </div>
                    );
                  }
                  if (part.type === "reasoning") {
                    return (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-2 my-1 italic"
                      >
                        {part.text}
                      </div>
                    );
                  }
                  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
                    const toolPart = part as any;
                    const toolName = toolPart.toolName || part.type.replace("tool-", "");
                    
                    let statusText = "";
                    let statusColor = "text-muted-foreground";
                    if (toolPart.state === "input-streaming") {
                      statusText = "Running...";
                    } else if (toolPart.state === "input-available") {
                      statusText = "Ready to run";
                    } else if (toolPart.state === "output-available") {
                      statusText = "Completed";
                      statusColor = "text-emerald-500 font-medium dark:text-emerald-400";
                    } else if (toolPart.state === "output-error") {
                      statusText = "Error";
                      statusColor = "text-destructive font-medium";
                    }

                    return (
                      <div
                        key={index}
                        className="my-2 p-3 rounded-xl border border-border/60 bg-background/40 backdrop-blur-sm text-xs font-mono flex flex-col gap-2 shadow-sm min-w-[260px]"
                      >
                        <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Tool: {toolName}
                          </span>
                          <span className={statusColor}>{statusText}</span>
                        </div>
                        {toolPart.input && (
                          <div className="text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-lg overflow-x-auto max-h-24">
                            <strong className="text-foreground/70">Input:</strong>{" "}
                            {typeof toolPart.input === "object"
                              ? JSON.stringify(toolPart.input, null, 2)
                              : String(toolPart.input)}
                          </div>
                        )}
                        {toolPart.output && (
                          <div className="text-[10px] text-foreground/90 bg-muted/60 p-2 rounded-lg overflow-x-auto border border-border/20 max-h-40">
                            <strong className="text-foreground/70">Output:</strong>{" "}
                            {typeof toolPart.output === "object"
                              ? JSON.stringify(toolPart.output, null, 2)
                              : String(toolPart.output)}
                          </div>
                        )}
                        {toolPart.errorText && (
                          <div className="text-[10px] text-destructive bg-destructive/10 p-2 rounded-lg overflow-x-auto">
                            <strong>Error:</strong> {toolPart.errorText}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              {m.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 justify-start animate-pulse">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-primary animate-spin" />
            </div>
            <div className="flex max-w-[80%] flex-col gap-2 rounded-2xl bg-muted px-4 py-3 text-sm rounded-tl-sm text-muted-foreground flex-1">
              <div className="flex items-center justify-between">
                <span>Copilot is working...</span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => stop()}
                  className="h-6 px-2 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border/50">
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center w-full"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot something... (Press Enter to send)"
            className="pr-12 resize-none overflow-hidden max-h-32 shadow-sm rounded-xl"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input?.trim() || isLoading}
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
