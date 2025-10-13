import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import useData from '@/contexts/useData';
import { useAuth } from '@/contexts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const { tasks, projects, users } = useData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name}! I'm your AI assistant. I can help you with tasks, projects, and team information. Try asking me about:\n• Your current tasks\n• Project status\n• Team members\n• Upcoming deadlines`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Tasks queries
    if (lowerInput.includes('task') || lowerInput.includes('my work')) {
      const userTasks = tasks.filter(t => t.assigneeIds?.includes(user?.id || ''));
      if (userTasks.length === 0) {
        return "You don't have any tasks assigned at the moment.";
      }
      return `You have ${userTasks.length} tasks:\n${userTasks.map(t => 
        `• ${t.title} (${t.status}, priority: ${t.priority})`
      ).join('\n')}`;
    }

    // Projects queries
    if (lowerInput.includes('project')) {
      const userProjects = projects.filter(p => p.memberIds.includes(user?.id || ''));
      return `You're involved in ${userProjects.length} projects:\n${userProjects.map(p => 
        `• ${p.name} - ${p.progress}% complete (${p.status})`
      ).join('\n')}`;
    }

    // Team queries
    if (lowerInput.includes('team') || lowerInput.includes('member')) {
      return `We have ${users.length} team members:\n${users.map(u =>
        `• ${u.name} (${u.role})`
      ).join('\n')}`;
    }

    // Deadlines
    if (lowerInput.includes('deadline') || lowerInput.includes('due')) {
      const upcomingTasks = tasks
        .filter(t => {
          const dueDate = new Date(t.dueDate);
          const today = new Date();
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return diffDays <= 7 && diffDays >= 0 && t.assigneeIds?.includes(user?.id || '');
        });
      
      if (upcomingTasks.length === 0) {
        return "You don't have any tasks due in the next 7 days.";
      }
      
      return `You have ${upcomingTasks.length} task(s) due soon:\n${upcomingTasks.map(t => 
        `• ${t.title} - Due ${new Date(t.dueDate).toLocaleDateString()}`
      ).join('\n')}`;
    }

    // Default response
    return "I'm here to help! You can ask me about your tasks, projects, team members, or upcoming deadlines.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 gradient-indigo rounded-2xl flex items-center justify-center shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">
            Get instant help with your tasks and projects
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-card rounded-3xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
        {/* Messages */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'gradient-blue' : 'gradient-indigo'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'gradient-blue text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full gradient-indigo flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex items-center space-x-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your work..."
                className="flex-1 rounded-full h-12 px-6 bg-muted border-0"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="gradient-indigo text-white rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
