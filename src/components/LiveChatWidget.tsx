'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronDown, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { TransactionEvent, subscribeToTransactions, generateSimulatedTransaction } from '@/lib/liveTransactions';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
  time: string;
  txData?: TransactionEvent;
}

const BOT_REPLIES: Record<string, string> = {
  'How fast is delivery?':
    '⚡ Most bundles are delivered to your line in under 2 minutes. You can track your order live from payment approval to network confirmation.',
  'I haven\'t received my data':
    '😔 Sorry to hear that! If your data hasn\'t arrived within 5 minutes, tap "Get Help" on your order page. Our system will auto-retry or issue an instant wallet refund.',
  'Which payments do you accept?':
    '💳 We accept MTN Mobile Money, Telecel Cash, AT Money, and all local bank cards via our secure Paystack gateway.',
  'How do I become an agent?':
    '🚀 You can launch your own branded store in minutes! Visit /become-agent to register. You\'ll get wholesale prices and a private storefront URL.',
  'Is my information safe?':
    '🔒 Absolutely. All data is encrypted in transit and your phone number is only used for bundle delivery and transaction alerts. We never share your data.',
};

const QUICK_REPLIES = [
  'How fast is delivery?',
  'I haven\'t received my data',
  'Which payments do you accept?',
  'How do I become an agent?',
  'Is my information safe?',
];

const BOT_FALLBACK = [
  "I'll connect you with our support team right away. Please drop your concern below 👇",
  "Thanks for reaching out! One of our agents will respond within 5 minutes.",
  "I'm on it! Could you provide more details so I can assist you better?",
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const WELCOME_MSG: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "👋 Hi there! I'm **Ama**, FA Digital's support assistant. How can I help you today?",
  time: nowTime(),
};

// Simple markdown bold renderer
function RenderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </span>
  );
}

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [liveTxList, setLiveTxList] = useState<TransactionEvent[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to live transactions
  useEffect(() => {
    // Initial sample transaction for feed
    const sample = generateSimulatedTransaction();
    setLiveTxList([sample]);

    const unsubscribe = subscribeToTransactions((tx) => {
      setLiveTxList(prev => [tx, ...prev.slice(0, 19)]);
      
      // Inject system alert into chat stream
      const sysMsg: ChatMessage = {
        id: `sys-${tx.id}`,
        role: 'system',
        text: `⚡ **${tx.name}** has just bought **${tx.bundle}** (${tx.network}) for ${tx.amount}!`,
        time: nowTime(),
        txData: tx,
      };
      setMessages(prev => [...prev, sysMsg]);
    });

    // Generate periodic simulated transactions for activity feed
    const interval = setInterval(() => {
      const sim = generateSimulatedTransaction();
      setLiveTxList(prev => [sim, ...prev.slice(0, 19)]);
      
      const sysMsg: ChatMessage = {
        id: `sys-${sim.id}`,
        role: 'system',
        text: `⚡ **${sim.name}** has just bought **${sim.bundle}** (${sim.network}) for ${sim.amount}!`,
        time: nowTime(),
        txData: sim,
      };
      setMessages(prev => [...prev, sysMsg]);
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Clear unread on open
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimized, activeTab]);

  // Proactive message after 20s if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setUnread(1);
    }, 20000);
    return () => clearTimeout(timer);
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, time: nowTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      const replyText = BOT_REPLIES[text] ?? BOT_FALLBACK[Math.floor(Math.random() * BOT_FALLBACK.length)];
      const botMsg: ChatMessage = { id: `b-${Date.now()}`, role: 'bot', text: replyText, time: nowTime() };
      setTyping(false);
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(prev => prev + 1);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
        }}
      >
        {/* Chat Panel */}
        {open && (
          <div
            id="live-chat-panel"
            style={{
              width: '360px',
              maxWidth: 'calc(100vw - 3.5rem)',
              height: minimized ? '64px' : '520px',
              background: 'linear-gradient(180deg, #0B1628 0%, #060D1A 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,204,21,0.05)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'height 0.3s ease',
              animation: 'chatSlideIn 0.3s ease',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0F1C36 0%, #0A1528 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              flexShrink: 0,
              cursor: minimized ? 'pointer' : 'default',
            }} onClick={() => minimized && setMinimized(false)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FACC15, #F59E0B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 800, color: '#030712',
                  }}>A</div>
                  <span style={{
                    position: 'absolute', bottom: '1px', right: '1px',
                    width: '9px', height: '9px', borderRadius: '50%',
                    backgroundColor: '#10B981', border: '2px solid #0B1628',
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>Ama</span>
                    <span style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 700, padding: '0.1rem 0.35rem', background: 'rgba(16,185,129,0.12)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>Online</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '1px' }}>
                    {typing ? (
                      <span style={{ color: '#FACC15', fontWeight: 600 }}>typing...</span>
                    ) : (
                      'FA Digital Support · Live Activity'
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
                    style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', transition: 'background 0.2s' }}
                    title={minimized ? 'Expand' : 'Minimize'}
                  >
                    <ChevronDown size={15} style={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', transition: 'background 0.2s' }}
                    title="Close chat"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Sub-Header Tabs */}
              {!minimized && (
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '8px', gap: '2px' }}>
                  <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                      flex: 1,
                      padding: '0.3rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: activeTab === 'chat' ? 'rgba(250,204,21,0.15)' : 'transparent',
                      color: activeTab === 'chat' ? '#FACC15' : '#9CA3AF',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <MessageCircle size={12} />
                    Chat Support
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    style={{
                      flex: 1,
                      padding: '0.3rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: activeTab === 'activity' ? 'rgba(250,204,21,0.15)' : 'transparent',
                      color: activeTab === 'activity' ? '#FACC15' : '#9CA3AF',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Activity size={12} />
                    Live Activity ({liveTxList.length})
                  </button>
                </div>
              )}
            </div>

            {!minimized && (
              <>
                {activeTab === 'activity' ? (
                  /* Live Activity Tab View */
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      REAL-TIME TRANSACTIONS FEED
                    </div>
                    {liveTxList.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(250,204,21,0.1)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                          {tx.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tx.name} bought {tx.bundle}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '1px' }}>
                            {tx.network} • {tx.amount}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 700, flexShrink: 0 }}>
                          Delivered
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Chat Thread View */
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                          alignItems: msg.role === 'system' ? 'center' : 'flex-end',
                          justifyContent: msg.role === 'system' ? 'center' : 'flex-start',
                          gap: '0.5rem',
                          animation: 'msgFadeIn 0.25s ease',
                        }}
                      >
                        {msg.role === 'system' ? (
                          /* System Transaction Broadcast pill */
                          <div style={{
                            background: 'rgba(250,204,21,0.06)',
                            border: '1px solid rgba(250,204,21,0.2)',
                            borderRadius: '12px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.74rem',
                            color: '#F9FAFB',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            maxWidth: '92%',
                          }}>
                            <Zap size={13} style={{ color: '#FACC15', flexShrink: 0 }} />
                            <div>
                              <RenderText text={msg.text} />
                            </div>
                          </div>
                        ) : (
                          <>
                            {msg.role === 'bot' && (
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #FACC15, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#030712', flexShrink: 0 }}>
                                A
                              </div>
                            )}
                            <div style={{ maxWidth: '78%' }}>
                              <div style={{
                                padding: '0.7rem 0.95rem',
                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                background: msg.role === 'user'
                                  ? 'linear-gradient(135deg, #FACC15, #F59E0B)'
                                  : 'rgba(255,255,255,0.06)',
                                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                                fontSize: '0.83rem',
                                color: msg.role === 'user' ? '#030712' : '#E5E7EB',
                                fontWeight: msg.role === 'user' ? 700 : 400,
                                lineHeight: 1.55,
                              }}>
                                <RenderText text={msg.text} />
                              </div>
                              <div style={{ fontSize: '0.62rem', color: '#4B5563', marginTop: '3px', textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: '0.15rem' }}>
                                {msg.time}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                  {/* Typing indicator */}
                  {typing && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', animation: 'msgFadeIn 0.2s ease' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #FACC15, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#030712', flexShrink: 0 }}>A</div>
                      <div style={{ padding: '0.7rem 1rem', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FACC15', display: 'inline-block', animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
                )}

                {/* Quick reply chips */}
                {messages.length <= 2 && (
                  <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          background: 'rgba(250,204,21,0.06)',
                          border: '1px solid rgba(250,204,21,0.2)',
                          color: '#FACC15',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                          lineHeight: 1.4,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.12)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,204,21,0.06)'; }}
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input bar */}
                <form onSubmit={handleSubmit} style={{
                  padding: '0.85rem 1.25rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)',
                  flexShrink: 0,
                }}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '0.6rem 1rem',
                      color: '#FFFFFF',
                      fontSize: '0.83rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.3)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    style={{
                      width: '38px', height: '38px',
                      borderRadius: '12px',
                      background: input.trim() ? 'linear-gradient(135deg, #FACC15, #F59E0B)' : 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: input.trim() ? '#030712' : '#4B5563',
                      cursor: input.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <Send size={15} />
                  </button>
                </form>

                {/* Powered by label */}
                <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.62rem', color: '#374151' }}>
                  Powered by FA Digital Support
                </div>
              </>
            )}
          </div>
        )}

        {/* Trigger button */}
        <button
          id="live-chat-trigger"
          onClick={() => { setOpen(!open); setMinimized(false); }}
          style={{
            width: '58px', height: '58px',
            borderRadius: '50%',
            background: open ? '#1F2937' : 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
            border: open ? '1px solid rgba(255,255,255,0.1)' : 'none',
            color: open ? '#9CA3AF' : '#030712',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: open ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 28px rgba(250,204,21,0.4), 0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            flexShrink: 0,
          }}
          aria-label={open ? 'Close chat' : 'Open live chat'}
        >
          {/* Pulse ring when closed */}
          {!open && (
            <span style={{
              position: 'absolute', inset: '-4px',
              borderRadius: '50%',
              border: '2px solid rgba(250,204,21,0.35)',
              animation: 'chatRingPulse 2.5s ease-in-out infinite',
            }} />
          )}
          {open ? <X size={22} /> : <MessageCircle size={24} />}

          {/* Unread badge */}
          {!open && unread > 0 && (
            <span style={{
              position: 'absolute', top: '0px', right: '0px',
              width: '18px', height: '18px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '2px solid #040B18',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'badgePop 0.3s ease',
            }}>
              {unread}
            </span>
          )}
        </button>

        {/* "Need help?" tooltip when closed */}
        {!open && (
          <div style={{
            position: 'absolute', bottom: '70px', right: 0,
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: 0,
            animation: 'tooltipFadeIn 0.5s ease 25s forwards',
          }}>
            <Zap size={12} style={{ color: '#FACC15' }} />
            Need help? Chat with us!
          </div>
        )}
      </div>

      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatRingPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0; transform: scale(1.35); }
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        @keyframes tooltipFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
