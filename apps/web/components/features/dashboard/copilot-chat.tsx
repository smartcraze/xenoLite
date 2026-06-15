"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "@/lib/constants";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

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
    <div className="h-full overflow-hidden bg-background rounded-2xl border border-border/50">
      <Card className="h-full w-full border-0 rounded-none bg-background flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="w-full px-6 py-8 space-y-8">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[70vh] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Bot className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Ask anything about campaigns, audiences, analytics,
                  automation, or performance optimization.
                </p>
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
                    <div className="h-8 w-8 rounded-full border bg-background flex items-center justify-center shrink-0 sticky top-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/60 border border-border/50 rounded-bl-md"
                    }`}
                  >
                    {m.parts?.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <div key={index} className="flex flex-col gap-2">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-foreground">
                                    {children}
                                  </strong>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-5 mb-2 flex flex-col gap-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-5 mb-2 flex flex-col gap-1">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed">
                                    {children}
                                  </li>
                                ),
                                code: ({ children }) => (
                                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary font-semibold">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {m.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full border bg-background flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>

                <div className="rounded-2xl rounded-bl-md border bg-muted/50 px-5 py-4">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-background/95 backdrop-blur shrink-0">
          <div className="w-full p-4">
            <form onSubmit={handleFormSubmit} className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Copilot..."
                rows={1}
                disabled={isLoading}
                className="min-h-[56px] max-h-40 resize-none rounded-2xl border-border/60 bg-muted/30 pr-14 py-4 text-sm shadow-sm focus-visible:ring-1"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="absolute bottom-3 right-3 h-8 w-8 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
