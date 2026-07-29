'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Send, Bot, User, Zap, RefreshCw, X, Minimize2, Maximize2, Circle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
  time: string;
  status?: 'sending' | 'delivered' | 'read';
}

interface LiveTransaction {
  id: string;
  service: string;
  recipient: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  type: 'data' | 'airtime' | 'bill' | 'wallet';
  ref: string;
  timeAgo: string;
  isNew?: boolean;
}

// ─── Mock agent replies ────────────────────────────────────────────────────
const agentReplies: Record<string, string> = {
  default: "Thanks for reaching out! I'm reviewing your account details now. Could you please describe the issue in more detail?",
  hello: "Hello! 👋 Welcome to FA Digital Live Support. I'm your dedicated support agent. How can I help you today?",
  hi: "Hi there! 😊 Great to have you here. I'm ready to assist. What can I help you with?",
  wallet: "I can see your wallet activity in real-time right now. Your current balance is GH₵25,680.50. Is there a specific transaction you'd like me to look into?",
  mtn: "I'm checking MTN network status for your account. MTN MoMo services are currently operational. If you experienced an issue, I can escalate it — please share the transaction reference.",
  refund: "I've pulled up your account's recent transactions on my end. To process a refund, I'll need the transaction reference (e.g. TX_MTN_XXXX) and the date of the transaction. Please provide those.",
  failed: "I can see some transaction activity on my screen. Let me trace the failed transaction. Could you share the reference ID? It usually starts with TX_ and can be found in your transaction history.",
  data: "Data bundle purchases are processed instantly. If your data was not delivered, I'll raise an immediate service ticket. Please share the recipient number and the bundle amount.",
  airtime: "Airtime top-ups typically complete within seconds. I'm checking the network provider status for you now. Please share the phone number and amount.",
  bill: "Utility bill payments sometimes take up to 2 hours to reflect. I see some bill transactions in your recent activity. Can you share the meter/account number?",
};

function getAgentReply(text: string): string {
  const lower = text.toLowerCase();
  for (const key of Object.keys(agentReplies)) {
    if (key !== 'default' && lower.includes(key)) return agentReplies[key];
  }
  return agentReplies.default;
}

// ─── Mock live transactions ────────────────────────────────────────────────
const transactionPool: Omit<LiveTransaction, 'id' | 'timeAgo' | 'isNew'>[] = [
  { service: 'MTN Data CG 10GB', recipient: '0244-XXX-456', amount: 40.00, status: 'success', type: 'data', ref: 'TX_MTN_' + Math.floor(Math.random() * 9999) },
  { service: 'Telecel Airtime', recipient: '0205-XXX-789', amount: 5.00, status: 'success', type: 'airtime', ref: 'TX_TEL_' + Math.floor(Math.random() * 9999) },
  { service: 'AirtelTigo 5GB', recipient: '0278-XXX-123', amount: 20.00, status: 'pending', type: 'data', ref: 'TX_ATG_' + Math.floor(Math.random() * 9999) },
  { service: 'ECG Prepaid', recipient: '1020-XXXXX-60', amount: 100.00, status: 'success', type: 'bill', ref: 'TX_ECG_' + Math.floor(Math.random() * 9999) },
  { service: 'Wallet Fund', recipient: 'Self', amount: 200.00, status: 'success', type: 'wallet', ref: 'TX_WLT_' + Math.floor(Math.random() * 9999) },
  { service: 'MTN Airtime', recipient: '0244-XXX-999', amount: 2.00, status: 'failed', type: 'airtime', ref: 'TX_MTN_' + Math.floor(Math.random() * 9999) },
  { service: 'DStv Premium', recipient: 'IUC-XXXXXXX', amount: 280.00, status: 'success', type: 'bill', ref: 'TX_DST_' + Math.floor(Math.random() * 9999) },
  { service: 'Telecel Data 2GB', recipient: '0205-XXX-321', amount: 8.00, status: 'success', type: 'data', ref: 'TX_TEL_' + Math.floor(Math.random() * 9999) },
  { service: 'GWCL Water', recipient: '7123-XXXXX', amount: 60.00, status: 'pending', type: 'bill', ref: 'TX_WTR_' + Math.floor(Math.random() * 9999) },
  { service: 'MTN Data CG 1GB', recipient: '0556-XXX-444', amount: 6.00, status: 'success', type: 'data', ref: 'TX_MTN_' + Math.floor(Math.random() * 9999) },
];

function makeTransaction(): LiveTransaction {
  const base = transactionPool[Math.floor(Math.random() * transactionPool.length)];
  return {
    ...base,
    id: crypto.randomUUID(),
    timeAgo: 'just now',
    isNew: true,
    ref: base.ref.split('_').slice(0, 2).join('_') + '_' + Math.floor(Math.random() * 9999),
  };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const typeIcon: Record<string, string> = {
  data: '🌐',
  airtime: '📱',
  bill: '⚡',
  wallet: '💰',
};

const statusColors: Record<string, string> = {
  success: '#34D399',
  failed: '#F87171',
  pending: '#FBBF24',
};

// ─── Component ────────────────────────────────────────────────────────────
export default function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      text: "Hello! 👋 Welcome to FA Digital Live Support. I'm your dedicated support agent. How can I help you today?",
      time: formatTime(new Date()),
      status: 'read',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>(() =>
    Array.from({ length: 5 }, makeTransaction).map((t) => ({ ...t, isNew: false }))
  );
  const [txPaused, setTxPaused] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [agentOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const txIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Live transaction ticker
  const startTicker = useCallback(() => {
    if (txIntervalRef.current) clearInterval(txIntervalRef.current);
    txIntervalRef.current = setInterval(() => {
      if (!txPaused) {
        setLiveTransactions((prev) => {
          const newTx = makeTransaction();
          // Age older entries
          const aged = prev.map((t) => ({ ...t, isNew: false }));
          return [newTx, ...aged].slice(0, 12);
        });
      }
    }, 3200);
  }, [txPaused]);

  useEffect(() => {
    startTicker();
    return () => { if (txIntervalRef.current) clearInterval(txIntervalRef.current); };
  }, [startTicker, txPaused]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
      time: formatTime(new Date()),
      status: 'sending',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate message status progression
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 600);

    // Simulate agent typing + reply
    const delay = 1200 + Math.random() * 1200;
    setTimeout(() => {
      setTyping(false);
      const reply = getAgentReply(trimmed);
      const agentMsg: Message = {
        id: crypto.randomUUID(),
        role: 'agent',
        text: reply,
        time: formatTime(new Date()),
        status: 'read',
      };
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m)),
        agentMsg,
      ]);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout userName="Kwame Mensah" userRole="customer">
      <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>💬 Live Chat Support</h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              fontSize: '0.72rem', fontWeight: 700, color: '#34D399',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              AGENT ONLINE
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Chat with a support agent in real-time. Your recent transactions are visible on the right.
          </p>
        </div>

        {/* Main Chat + Transaction Panel Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: panelExpanded ? '1fr 360px' : '1fr 52px',
          gap: '1rem',
          alignItems: 'start',
          transition: 'grid-template-columns 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* ── Chat Panel ── */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '76vh',
            minHeight: '520px',
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              display: 'flex', alignItems: 'center', gap: '0.875rem',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FACC15 0%, #D97706 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>🤝</div>
                <span style={{
                  position: 'absolute', bottom: '0', right: '0',
                  width: '11px', height: '11px', borderRadius: '50%',
                  background: agentOnline ? '#10B981' : '#6B7280',
                  border: '2px solid var(--color-bg-surface)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>FA Support Agent</div>
                <div style={{ fontSize: '0.72rem', color: agentOnline ? '#34D399' : 'var(--color-text-muted)' }}>
                  {agentOnline ? '● Online · Typically replies instantly' : '○ Away'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                  background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-muted)',
                }}>TKT-9944</span>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.875rem',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent',
            }}>
              {/* Date separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>Today</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>

              {messages.map((msg) => (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end', gap: '0.6rem',
                  animation: 'fadeUp 0.25s ease both',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'agent'
                      ? 'linear-gradient(135deg, #FACC15 0%, #D97706 100%)'
                      : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}>
                    {msg.role === 'agent' ? <Bot size={14} color="#030712" /> : <User size={14} color="#fff" />}
                  </div>

                  {/* Bubble */}
                  <div style={{ maxWidth: '72%' }}>
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: msg.role === 'user'
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #FACC15 0%, #D97706 100%)'
                        : 'var(--color-bg-elevated)',
                      color: msg.role === 'user' ? '#030712' : 'var(--color-text-primary)',
                      fontSize: '0.88rem',
                      lineHeight: '1.55',
                      border: msg.role === 'agent' ? '1px solid var(--color-border)' : 'none',
                      boxShadow: msg.role === 'user'
                        ? '0 4px 12px rgba(250,204,21,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      marginTop: '0.3rem',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-subtle)' }}>{msg.time}</span>
                      {msg.role === 'user' && msg.status && (
                        <span style={{ fontSize: '0.65rem', color: msg.status === 'read' ? '#34D399' : 'var(--color-text-subtle)' }}>
                          {msg.status === 'sending' ? '○' : msg.status === 'delivered' ? '✓' : '✓✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', animation: 'fadeUp 0.2s ease' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #FACC15 0%, #D97706 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={14} color="#030712" />
                  </div>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--color-text-muted)',
                        display: 'inline-block',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div style={{
              padding: '0.625rem 1.25rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
            }}>
              {['Wallet issue', 'Failed transaction', 'Refund request', 'Data not delivered'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor = 'var(--color-brand-primary)';
                    (e.target as HTMLButtonElement).style.color = 'var(--color-brand-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div style={{
              padding: '0.875rem 1.25rem',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message…"
                id="chat-input"
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  background: 'var(--color-bg-elevated)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.88rem', outline: 'none',
                  transition: 'all 0.18s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brand-primary)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(250,204,21,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={sendMessage}
                id="btn-send-chat"
                disabled={!input.trim()}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: input.trim()
                    ? 'linear-gradient(135deg, #FACC15 0%, #D97706 100%)'
                    : 'var(--color-bg-elevated)',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                  boxShadow: input.trim() ? '0 4px 12px rgba(250,204,21,0.25)' : 'none',
                }}
              >
                <Send size={16} color={input.trim() ? '#030712' : 'var(--color-text-subtle)'} />
              </button>
            </div>
          </div>

          {/* ── Live Transactions Panel ── */}
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: '76vh',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Panel Header */}
            <div style={{
              padding: '0.875rem 1rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
            }}>
              {panelExpanded ? (
                <>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                    animation: 'pulse 2s infinite',
                  }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, flex: 1, color: 'var(--color-text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Live Transactions
                  </span>
                  <button
                    onClick={() => setTxPaused(!txPaused)}
                    title={txPaused ? 'Resume' : 'Pause'}
                    style={{
                      background: 'none', border: 'none',
                      color: txPaused ? '#FBBF24' : 'var(--color-text-muted)',
                      cursor: 'pointer', padding: '0.2rem',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {txPaused ? <RefreshCw size={13} /> : <Circle size={13} />}
                  </button>
                  <button
                    onClick={() => setPanelExpanded(false)}
                    title="Collapse"
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                  >
                    <Minimize2 size={13} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setPanelExpanded(true)}
                  title="Expand transactions"
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-text-muted)',
                    cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center',
                    width: '100%', justifyContent: 'center',
                  }}
                >
                  <Maximize2 size={14} />
                </button>
              )}
            </div>

            {panelExpanded && (
              <>
                {/* Pause notice */}
                {txPaused && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(245,158,11,0.08)',
                    borderBottom: '1px solid rgba(245,158,11,0.15)',
                    fontSize: '0.72rem', color: '#FBBF24', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}>
                    <Zap size={11} /> Stream paused — click ▶ to resume
                  </div>
                )}

                {/* Transaction list */}
                <div style={{
                  flex: 1, overflowY: 'auto',
                  scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent',
                }}>
                  {liveTransactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        background: tx.isNew ? 'rgba(250,204,21,0.04)' : 'transparent',
                        animation: tx.isNew ? 'txSlideIn 0.4s ease' : 'none',
                        transition: 'background 1.5s ease',
                      }}
                    >
                      {/* Type icon */}
                      <div style={{
                        width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg-elevated)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', flexShrink: 0,
                        border: tx.isNew ? '1px solid rgba(250,204,21,0.2)' : '1px solid transparent',
                      }}>
                        {typeIcon[tx.type]}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.78rem', fontWeight: 600,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          color: 'var(--color-text-primary)',
                        }}>
                          {tx.service}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-subtle)', marginTop: '0.1rem', fontFamily: 'monospace' }}>
                          {tx.ref} · {tx.recipient}
                        </div>
                      </div>

                      {/* Amount + status */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>
                          GH₵{tx.amount.toFixed(2)}
                        </div>
                        <div style={{
                          fontSize: '0.6rem', fontWeight: 700, marginTop: '0.15rem',
                          color: statusColors[tx.status],
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>
                          {tx.status === 'pending' ? '⏳' : tx.status === 'success' ? '✓' : '✗'} {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer stats */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid var(--color-border)',
                  background: 'var(--color-bg-surface)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-subtle)' }}>
                    {liveTransactions.filter(t => t.status === 'success').length} success ·{' '}
                    {liveTransactions.filter(t => t.status === 'failed').length} failed ·{' '}
                    {liveTransactions.filter(t => t.status === 'pending').length} pending
                  </span>
                  <span style={{ fontSize: '0.65rem', color: txPaused ? '#FBBF24' : '#34D399', fontWeight: 700 }}>
                    {txPaused ? '⏸ Paused' : '● Live'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes txSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </AppLayout>
  );
}
