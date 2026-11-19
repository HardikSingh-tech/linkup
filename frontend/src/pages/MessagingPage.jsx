import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { useAuthStore } from '../store/authStore';
import { timeAgo } from '../utils/dateUtils';
import api from '../api/axios';
import { MessageSquare, Send } from 'lucide-react';

export default function MessagingPage() {
  const { user: currentUser } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/messages/conversations');
      const list = res.data || [];
      setConversations(list);
      if (!selectedPartner && list.length > 0) {
        setSelectedPartner(list[0].partner);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchThread = async (partnerId, silent = false) => {
    try {
      const res = await api.get(`/messages/${partnerId}`);
      setMessages(res.data || []);
      // mark as read
      api.put(`/messages/${partnerId}/read`).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchThread(selectedPartner.id);
      // Poll every 5s
      const interval = setInterval(() => {
        fetchThread(selectedPartner.id, true);
        fetchConversations(true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !selectedPartner || sending) return;

    const messageContent = text.trim();
    setText('');
    setSending(true);

    try {
      const res = await api.post(`/messages/${selectedPartner.id}`, { content: messageContent });
      setMessages(prev => [...prev, res.data]);
      fetchConversations(true);
    } catch (err) {
      alert('Failed to send message');
      setText(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="bg-white border border-brand-border rounded-xl shadow-xs overflow-hidden grid grid-cols-12 h-[680px]">
        {/* Left conversations list (4.5 cols) */}
        <div className="col-span-5 border-r border-brand-border flex flex-col h-full">
          <div className="p-3.5 border-b border-brand-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Messaging</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
            {loading ? (
              <div className="py-12 flex justify-center"><Spinner size="md" /></div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No conversations yet. Visit someone's profile to start a chat!
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.partner.id}
                  onClick={() => setSelectedPartner(conv.partner)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition ${
                    selectedPartner?.id === conv.partner.id ? 'bg-brand-light border-l-4 border-l-brand-blue' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <Avatar src={conv.partner.avatarUrl} name={`${conv.partner.firstName} ${conv.partner.lastName}`} size="md" />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-blue rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {conv.partner.firstName} {conv.partner.lastName}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                        {timeAgo(conv.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right chat message pane (7.5 cols) */}
        <div className="col-span-7 flex flex-col h-full">
          {selectedPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-brand-border flex items-center space-x-3 bg-white">
                <Avatar src={selectedPartner.avatarUrl} name={`${selectedPartner.firstName} ${selectedPartner.lastName}`} size="sm" />
                <div>
                  <h3 className="text-xs font-bold text-gray-900">
                    {selectedPartner.firstName} {selectedPartner.lastName}
                  </h3>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{selectedPartner.headline}</p>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBFA]">
                {messages.map(m => {
                  const isMe = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-brand-blue text-white rounded-br-xs'
                            : 'bg-white border border-brand-border text-gray-800 rounded-bl-xs'
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 px-1">
                        {timeAgo(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-brand-border bg-white flex items-center space-x-2">
                <textarea
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message... (Press Enter to send)"
                  className="flex-1 text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue focus:outline-none resize-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!text.trim() || sending}
                  className="h-10 px-4"
                >
                  {sending ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={MessageSquare}
                title="Your messages"
                description="Send a message to your connections to start a conversation."
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
