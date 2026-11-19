import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Avatar from './Avatar';
import Card from './Card';
import { Bookmark, Users } from 'lucide-react';

export default function ProfileCard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Card className="text-center relative">
      {/* Cover / Banner */}
      <div className="h-16 w-full overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800">
        {user.bannerUrl && (
          <img
            src={user.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar */}
      <div
        onClick={() => navigate(`/in/${user.id}`)}
        className="relative -mt-9 flex justify-center cursor-pointer group"
      >
        <Avatar
          src={user.avatarUrl}
          name={`${user.firstName} ${user.lastName}`}
          size="lg"
          className="border-2 border-white shadow-sm group-hover:opacity-95 transition"
        />
      </div>

      {/* Details */}
      <div className="p-4 border-b border-brand-border">
        <h3
          onClick={() => navigate(`/in/${user.id}`)}
          className="text-sm font-bold text-gray-900 hover:underline cursor-pointer"
        >
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {user.headline || 'Professional at LinkUp'}
        </p>
      </div>

      {/* Quick stats & shortcuts */}
      <div className="py-2 text-left text-xs font-semibold text-gray-600">
        <div
          onClick={() => navigate('/mynetwork')}
          className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
        >
          <span className="text-gray-500">Connections</span>
          <span className="text-brand-blue font-bold">Grow network</span>
        </div>
        <div
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center text-gray-700"
        >
          <Bookmark className="w-3.5 h-3.5 mr-2 text-gray-500" />
          <span>My Saved Jobs</span>
        </div>
      </div>
    </Card>
  );
}
