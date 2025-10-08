import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Clock, Star, Zap, Mic, MicOff, Send, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Milestone {
  title: string;
  description: string;
  estimatedTime: number;
  xp: number;
  energy: string;
}

const SmartGuidance = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Please try again or type your task",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Speak your task description",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("smart-guidance-chat", {
        body: { messages: [...messages, userMessage] }
      });

      if (error) throw error;

      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: assistantMessage }]);

      // Try to parse milestones from response
      try {
        const jsonMatch = assistantMessage.match(/\{[\s\S]*"milestones"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.milestones && Array.isArray(parsed.milestones)) {
            setMilestones(parsed.milestones);
          }
        }
      } catch (e) {
        // Response doesn't contain milestones yet, continue conversation
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startMilestone = (milestone: Milestone) => {
    const taskData = {
      title: milestone.title,
      description: milestone.description,
      estimatedTime: milestone.estimatedTime,
      xp: milestone.xp,
      type: "smart-guidance",
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem("kaizen-current-task", JSON.stringify(taskData));
    navigate("/focus");
  };

  const energyColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    balanced: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", 
    focused: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    peak: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-4">
        <div className="flex items-center mb-4 gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-growth">Smart Guidance</h1>
          </div>
        </div>

        <Card className="p-4 shadow-zen bg-card/90 backdrop-blur-sm mb-4 rounded-3xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-growth mb-1">AI Task Assistant</h2>
              <p className="text-sm text-zen">Describe your task and I'll help you break it into manageable steps!</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-zen text-sm mb-2">👋 Hey there!</p>
                <p className="text-muted-foreground text-xs">Tell me about your task and I'll help you plan it out</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Describe your task or ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-12 rounded-full bg-background/50 border-primary/20 focus:border-primary"
                disabled={isLoading}
              />
              <Button
                onClick={toggleVoiceInput}
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full ${
                  isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-growth">Your Milestones</h3>
            </div>
            {milestones.map((milestone, index) => (
              <Card key={index} className="p-4 shadow-zen bg-card/90 backdrop-blur-sm hover:shadow-lg transition-shadow rounded-3xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-growth mb-1">{milestone.title}</h4>
                    <p className="text-sm text-zen">{milestone.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 rounded-full">
                    #{index + 1}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{milestone.estimatedTime}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{milestone.xp} XP</span>
                    </div>
                    <Badge 
                      className={`${energyColors[milestone.energy]} text-xs rounded-full`}
                      variant="secondary"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {milestone.energy}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={() => startMilestone(milestone)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-full font-semibold"
                  size="sm"
                >
                  Start This Milestone
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartGuidance;
