import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Upload, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Security Assistant. I can help you analyze vulnerability reports, provide patch recommendations, and answer questions about your security posture. Upload a report or ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: "I've analyzed your query. Based on current threat intelligence, I recommend prioritizing patches for CVE-2024-21887 and CVE-2024-38112. Would you like me to generate a detailed remediation plan?",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        const aiMessage: Message = {
          role: "assistant",
          content: `📊 Report Analysis Complete:\n\n• Total Vulnerabilities: 43\n• Critical CVEs: 8\n• High Priority: 15\n• Recommended Actions: Patch CVE-2024-21887, CVE-2024-38112, and CVE-2024-43093 immediately\n• Estimated Risk Reduction: 67%\n\nWould you like me to generate a prioritized remediation plan?`,
        };
        setMessages((prev) => [...prev, aiMessage]);
        toast.success("Report uploaded and analyzed successfully");
      }, 2000);
    }
  };

  return (
    <div className="p-8 space-y-6 h-[calc(100vh-4rem)]">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">Intelligent security analysis and recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-6rem)]">
        {/* Upload Section */}
        <Card className="glass-card p-6 lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Upload Report</h3>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer flex-1 flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".pdf,.csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="ai-file-upload"
            />
            <label htmlFor="ai-file-upload" className="cursor-pointer w-full">
              <FileText className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drop report here or click to upload</p>
              <p className="text-xs text-muted-foreground">PDF, CSV, XLSX (Max 50MB)</p>
              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: "67%" }} />
                  </div>
                  <p className="text-xs text-center mt-2 text-muted-foreground">Analyzing report...</p>
                </div>
              )}
            </label>
          </div>

          <div className="mt-6 space-y-3">
            <div className="glass-panel p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">AI Capabilities</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Vulnerability report analysis</li>
                <li>Risk prioritization</li>
                <li>Patch recommendations</li>
                <li>Threat intelligence insights</li>
                <li>Compliance guidance</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="glass-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">AI Security Analyst</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`glass-panel p-4 rounded-xl animate-fade-in ${
                  message.role === "user"
                    ? "ml-auto bg-primary/10 max-w-[80%]"
                    : "mr-auto bg-card/50 max-w-[90%]"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === "assistant" && (
                    <Badge variant="outline" className="text-xs">AI</Badge>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              placeholder="Ask about vulnerabilities, reports, or patch insights..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="pr-12 glow-primary"
            />
            <Button
              size="sm"
              onClick={handleSend}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 gradient-primary hover:glow-accent"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
