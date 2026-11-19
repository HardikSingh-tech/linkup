import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Avatar from './Avatar';
import Button from './Button';
import Spinner from './Spinner';
import api from '../api/axios';
import { UserPlus, Check } from 'lucide-react';

export default function SuggestionsWidget({ onConnectionSent }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingMap, setConnectingMap] = useState({});
  const navigate = useNavigate();

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/users/suggestions');
      setSuggestions(res.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleConnect = async (userId) => {
    setConnectingMap(prev => ({ ...prev, [userId]: 'loading' }));
    try {
      await api.post(`/connections/request/${userId}`);
      setConnectingMap(prev => ({ ...prev, [userId]: 'sent' }));
      if (onConnectionSent) onConnectionSent(userId);
    } catch (err) {
      console.error(err);
      setConnectingMap(prev => ({ ...prev, [userId]: null }));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">Add to your feed</h3>
      </div>

      {loading ? (
        <Spinner size="sm" className="py-4" />
      ) : suggestions.length === 0 ? (
        <p className="text-xs text-gray-400 py-2">No new suggestions</p>
      ) : (
        <div className="space-y-3.5">
          {suggestions.map((u) => {
            const status = connectingMap[u.id];
            return (
              <div key={u.id} className="flex items-start space-x-3">
                <div onClick={() => navigate(`/in/${u.id}`)} className="cursor-pointer">
                  <Avatar src={u.avatarUrl} name={`${u.firstName} ${u.lastName}`} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => navigate(`/in/${u.id}`)}
                    className="text-xs font-bold text-gray-900 hover:underline cursor-pointer truncate"
                  >
                    {u.firstName} {u.lastName}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight mt-0.5">
                    {u.headline}
                  </p>
                  <div className="mt-2">
                    {status === 'sent' ? (
                      <span className="inline-flex items-center text-xs font-medium text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                        <Check className="w-3.5 h-3.5 mr-1" /> Pending
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={status === 'loading'}
                        onClick={() => handleConnect(u.id)}
                        icon={UserPlus}
                      >
                        {status === 'loading' ? 'Sending...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
