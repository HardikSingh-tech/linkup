import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ProfileCard from '../components/ProfileCard';
import { timeAgo } from '../utils/dateUtils';
import api from '../api/axios';
import { Bell, Check, ThumbsUp, MessageSquare, UserPlus } from 'lucide-react';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <ThumbsUp className="w-4 h-4 text-brand-blue" />;
      case 'POST_COMMENT':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <AppLayout leftCol={<ProfileCard />}>
      <Card className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <h2 className="text-base font-bold text-gray-900">Notifications</h2>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You'll be notified when your network connects, likes, or comments on your work."
          />
        ) : (
          <div className="divide-y divide-brand-border">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.type === 'CONNECTION_REQUEST' || n.type === 'CONNECTION_ACCEPTED') {
                    navigate('/mynetwork');
                  } else {
                    navigate('/');
                  }
                }}
                className={`py-3.5 px-2 flex items-start space-x-3 cursor-pointer rounded transition ${
                  !n.isRead ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Avatar src={n.actor?.avatarUrl} name={`${n.actor?.firstName} ${n.actor?.lastName}`} size="md" />
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs">
                    {getIcon(n.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>

                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
