import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import api from '../api/axios';
import { Users, UserCheck, UserPlus, Check, X } from 'lucide-react';

export default function NetworkPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('grow'); // 'grow' or 'connections'
  const [pending, setPending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, suggRes, connRes] = await Promise.all([
        api.get('/connections/pending'),
        api.get('/users/suggestions'),
        api.get('/connections'),
      ]);
      setPending(pendingRes.data || []);
      setSuggestions(suggRes.data || []);
      setConnections(connRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.put(`/connections/${id}/accept`);
      fetchData();
    } catch (err) {
      alert('Failed to accept');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.put(`/connections/${id}/reject`);
      fetchData();
    } catch (err) {
      alert('Failed to reject');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleConnect = async (userId) => {
    setActionLoading(prev => ({ ...prev, [`user_${userId}`]: true }));
    try {
      await api.post(`/connections/request/${userId}`);
      setSuggestions(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to send request');
    } finally {
      setActionLoading(prev => ({ ...prev, [`user_${userId}`]: false }));
    }
  };

  const leftNav = (
    <Card className="p-3 text-xs">
      <h3 className="font-bold text-gray-900 px-3 py-2 border-b border-brand-border">Manage my network</h3>
      <div className="mt-2 space-y-1">
        <button
          onClick={() => setActiveTab('grow')}
          className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
            activeTab === 'grow' ? 'bg-brand-light font-bold text-brand-blue' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center"><UserPlus className="w-4 h-4 mr-2" /> Invitations & Grow</span>
          {pending.length > 0 && (
            <span className="bg-brand-blue text-white rounded-full px-2 py-0.5 text-[10px]">
              {pending.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
            activeTab === 'connections' ? 'bg-brand-light font-bold text-brand-blue' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center"><UserCheck className="w-4 h-4 mr-2" /> Connections</span>
          <span className="text-gray-500 font-semibold">{connections.length}</span>
        </button>
      </div>
    </Card>
  );

  return (
    <AppLayout leftCol={leftNav}>
      {loading ? (
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      ) : activeTab === 'connections' ? (
        /* Connections list */
        <Card className="p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">{connections.length} Connections</h2>
          {connections.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No connections yet"
              description="Browse suggestions to connect with leaders in your industry."
            />
          ) : (
            <div className="divide-y divide-brand-border">
              {connections.map((c) => {
                const partner = c.requester.id === c.receiver.id ? c.requester : (c.requester.headline ? c.requester : c.receiver);
                return (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div
                      onClick={() => navigate(`/in/${partner.id}`)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Avatar src={partner.avatarUrl} name={`${partner.firstName} ${partner.lastName}`} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-blue group-hover:underline">
                          {partner.firstName} {partner.lastName}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{partner.headline}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/messaging')}>
                      Message
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      ) : (
        /* Grow network / Pending requests + Suggestions */
        <div className="space-y-4">
          {/* Pending Invitations */}
          {pending.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Pending Invitations ({pending.length})</h3>
              <div className="divide-y divide-brand-border">
                {pending.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div
                      onClick={() => navigate(`/in/${p.requester.id}`)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <Avatar src={p.requester.avatarUrl} name={`${p.requester.firstName} ${p.requester.lastName}`} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-blue group-hover:underline">
                          {p.requester.firstName} {p.requester.lastName}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{p.requester.headline}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={actionLoading[p.id]}
                        onClick={() => handleReject(p.id)}
                      >
                        Ignore
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={actionLoading[p.id]}
                        onClick={() => handleAccept(p.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* People you may know Grid */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">People you may know</h3>
            {suggestions.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No more suggestions right now.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {suggestions.map((u) => (
                  <div
                    key={u.id}
                    className="border border-brand-border rounded-lg p-3 text-center flex flex-col items-center justify-between bg-white hover:shadow-xs transition"
                  >
                    <div onClick={() => navigate(`/in/${u.id}`)} className="cursor-pointer flex flex-col items-center">
                      <Avatar src={u.avatarUrl} name={`${u.firstName} ${u.lastName}`} size="lg" className="mb-2" />
                      <h4 className="text-xs font-bold text-gray-900 hover:underline line-clamp-1">
                        {u.firstName} {u.lastName}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 h-8 mt-1 leading-tight">
                        {u.headline}
                      </p>
                    </div>
                    <div className="mt-3 w-full">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        disabled={actionLoading[`user_${u.id}`]}
                        onClick={() => handleConnect(u.id)}
                        icon={UserPlus}
                      >
                        {actionLoading[`user_${u.id}`] ? 'Connecting...' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
