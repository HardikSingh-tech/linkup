import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Avatar from './Avatar';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        // silent
      }
    };
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
          setSearchResults(res.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center min-w-[72px] h-full relative cursor-pointer group text-xs font-normal border-b-2 transition-colors ${
      isActive
        ? 'text-gray-900 border-gray-900 font-semibold'
        : 'text-gray-500 border-transparent hover:text-gray-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border h-[54px] px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3 w-[450px]">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded bg-brand-blue flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-blue">
            Link<span className="text-gray-900">Up</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1" ref={searchRef}>
          <div className="flex items-center bg-[#EDF3F8] rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-gray-900 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search professionals, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-gray-900 placeholder-gray-500 w-full focus:outline-none"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-brand-border rounded-lg shadow-lg max-h-80 overflow-y-auto py-2 z-50">
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    navigate(`/in/${u.id}`);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 cursor-pointer"
                >
                  <Avatar src={u.avatarUrl} name={`${u.firstName} ${u.lastName}`} size="sm" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{u.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center h-full space-x-1">
        <NavLink to="/" className={navItemClass}>
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/mynetwork" className={navItemClass}>
          <Users className="w-5 h-5 mb-0.5" />
          <span>My Network</span>
        </NavLink>

        <NavLink to="/jobs" className={navItemClass}>
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Jobs</span>
        </NavLink>

        <NavLink to="/messaging" className={navItemClass}>
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Messaging</span>
        </NavLink>

        <NavLink to="/notifications" className={navItemClass}>
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span>Notifications</span>
        </NavLink>

        <div className="h-8 w-[1px] bg-brand-border mx-2" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex flex-col items-center justify-center min-w-[64px] h-full text-xs text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <Avatar src={user?.avatarUrl} name={`${user?.firstName} ${user?.lastName}`} size="xs" />
            <div className="flex items-center mt-0.5 text-[11px]">
              <span>Me</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-gray-500" />
            </div>
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 top-12 w-64 bg-white border border-brand-border rounded-lg shadow-xl py-2 z-50 animate-fadeIn"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div
                onClick={() => {
                  navigate(`/in/${user?.id}`);
                  setShowDropdown(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 border-b border-brand-border hover:bg-slate-50 cursor-pointer"
              >
                <Avatar src={user?.avatarUrl} name={`${user?.firstName} ${user?.lastName}`} size="md" />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{user?.headline}</p>
                </div>
              </div>

              <div className="px-2 pt-2">
                <button
                  onClick={() => {
                    navigate(`/in/${user?.id}`);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-brand-blue rounded hover:bg-brand-light flex items-center"
                >
                  <User className="w-3.5 h-3.5 mr-2" /> View Profile
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 rounded hover:bg-red-50 flex items-center mt-1"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
