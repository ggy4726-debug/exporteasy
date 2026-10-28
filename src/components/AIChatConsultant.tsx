import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ShieldAlert,
  Building2,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const QUICK_PROMPTS = [
  '🇺🇸 미국 아마존에 화장품 첫 수출 시 FDA MoCRA 및 필수 서류 알려줘',
  '📄 간이수출신고(400만원 이하)와 일반수출신고의 차이점과 방법은?',
  '🔍 내 상품의 정확한 HS Code 6단위/10단위 찾는 가장 쉬운 방법',
  '💰 미국, 일본, EU의 소액면세(디미니미스) 한도와 관부가세 주의점',
  '📑 상업송장(Commercial Invoice) 작성 시 절대 실수하면 안 되는 3가지',
  '💵 해외 판매 시 부가세 10% 영세율 환급 및 수출실적 인정받는 법',
];

export const AIChatConsultant: React.FC<Props> = ({ initialPrompt, onClearInitialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `안녕하세요, 사장님! 대한민국 소상공인 해외수출·해외판매 전문 AI 컨설턴트 **'수출닥터'**입니다. 🇰🇷🚢

아마존, 쇼피, 라쿠텐, 큐텐, 엣시 등 해외 판매가 처음이신가요? 
궁금하신 점을 편하게 물어보시면 맞춤형으로 안내해 드립니다:

• **필수 서류**: 사업자 통관고유부호, 상업송장(Invoice), 원산지증명서(C/O)
• **세금 & 통관**: 미국/일본/EU 등 국가별 관세율 및 소액면세(De Minimis) 혜택
• **국제 배송**: 우체국 EMS, K-Packet, 특송(DHL/FedEx) 및 부피무게 절감 팁
• **국가별 필수 규제**: 화장품 FDA/CPNP, 식품 FFR, 전자기기 CE/FCC

*※ 안내드리는 내용은 일반적인 무역 가이드라인이며, 최종 세액 및 세번 확정은 관세청 유니패스(UNI-PASS) 및 공인 관세사를 통해 확인하시기 바랍니다.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle passed-in prompt from calculator
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const historyPayload = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: historyPayload,
          message: text,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || '서버 응답 오류');
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '답변을 생성하지 못했습니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '네트워크 오류';
      const fallbackMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `죄송합니다. 답변을 처리하는 도중 문제가 발생했습니다: ${errorMessage}\n\n잠시 후 다시 시도해 주시거나, 긴급한 통관 문의는 **관세청 콜센터 125**로 직접 문의하실 수 있습니다.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (confirm('대화 내용을 초기화하시겠습니까?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: '대화가 초기화되었습니다. 수출에 대해 새롭게 궁금하신 점을 알려주세요!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const copyMessageContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper for simple markdown rendering (bold, lists, paragraphs)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold syntax **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 leading-relaxed my-0.5">
            {renderedLine}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed my-0.5 text-slate-700">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Consultant Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                1:1 AI 수출 컨설턴트: 수출닥터 (ExportDoctor)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Gemini 3.8 Flash 연동
              </span>
            </div>
            <p className="text-xs text-slate-500">
              수출 서류, 통관 요건, HS CODE, 관부가세, 물류비 절감 질문에 실시간으로 답변해 드립니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>대화 초기화</span>
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
          💡 초보 사장님들이 가장 많이 묻는 추천 질문:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-full px-3.5 py-1.5 whitespace-nowrap transition shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Chat Thread */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 flex flex-col h-[520px] shadow-inner overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs ${
                    isUser ? 'bg-slate-800' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="group relative">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">{renderFormattedContent(msg.content)}</div>
                    )}
                  </div>

                  {/* Timestamp & Copy button */}
                  <div
                    className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyMessageContent(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition p-0.5 hover:text-slate-600 cursor-pointer"
                        title="답변 내용 복사"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-600 font-medium">수출 규정 및 통관 정보를 분석하고 있습니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 미국 아마존에 화장품 첫 수출 시 필요한 서류와 FDA 등록 절차가 궁금해요..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-blue-500 focus:bg-white resize-none"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">전송</span>
            </button>
          </form>

          {/* Sticky Mini Disclaimer in Chat footer */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>AI 정보는 참고용 가이드라인이며, 공식 통관은 관세청 유니패스에서 확인하세요.</span>
            </div>
            <a
              href="https://unipass.customs.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800 font-medium"
            >
              관세청 유니패스 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
