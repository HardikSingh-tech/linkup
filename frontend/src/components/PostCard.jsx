import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Avatar from './Avatar';
import Button from './Button';
import Spinner from './Spinner';
import { useAuthStore } from '../store/authStore';
import { timeAgo } from '../utils/dateUtils';
import api from '../api/axios';
import { ThumbsUp, MessageSquare, Trash2, Send } from 'lucide-react';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const isOwnPost = user?.id === post.author?.id;

  const handleLike = async () => {
    // Optimistic toggle
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(prev => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await api.post(`/posts/${post.id}/like`);
    } catch (err) {
      // rollback
      setLiked(!nextLiked);
      setLikeCount(prev => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await api.get(`/posts/${post.id}/comments`);
        setComments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: newComment.trim() });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          onClick={() => navigate(`/in/${post.author?.id}`)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <Avatar src={post.author?.avatarUrl} name={`${post.author?.firstName} ${post.author?.lastName}`} size="md" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-blue group-hover:underline">
              {post.author?.firstName} {post.author?.lastName}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-1">{post.author?.headline}</p>
            <span className="text-[11px] text-gray-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>

        {isOwnPost && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded transition"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-900 mt-3 whitespace-pre-line leading-relaxed">
        {post.content}
      </p>

      {/* Media Attachment */}
      {post.mediaUrl && (
        <div className="mt-3 -mx-4 overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={post.mediaUrl}
            alt="Post attachment"
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Reactions count */}
      <div className="flex items-center justify-between py-2 mt-3 border-b border-brand-border text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          {likeCount > 0 && (
            <span className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] mr-1">
                👍
              </span>
              <span>{likeCount}</span>
            </span>
          )}
        </div>
        <div>
          <button onClick={toggleComments} className="hover:underline">
            {comments.length || post.commentCount} comments
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around items-center pt-1 text-xs font-semibold text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded hover:bg-slate-100 transition ${
            liked ? 'text-brand-blue font-bold' : ''
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-brand-blue' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center space-x-1.5 px-4 py-2 rounded hover:bg-slate-100 transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-brand-border space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2">
            <Avatar src={user?.avatarUrl} name={`${user?.firstName} ${user?.lastName}`} size="sm" />
            <div className="flex-1 flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-gray-400">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="bg-transparent text-xs text-gray-900 w-full focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="text-brand-blue disabled:opacity-30 ml-2"
              >
                {submittingComment ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Comment list */}
          {loadingComments ? (
            <Spinner size="sm" className="py-2" />
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start space-x-2 text-xs">
                <div onClick={() => navigate(`/in/${c.author?.id}`)} className="cursor-pointer">
                  <Avatar src={c.author?.avatarUrl} name={`${c.author?.firstName} ${c.author?.lastName}`} size="sm" />
                </div>
                <div className="flex-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      onClick={() => navigate(`/in/${c.author?.id}`)}
                      className="font-bold text-gray-900 hover:underline cursor-pointer"
                    >
                      {c.author?.firstName} {c.author?.lastName}
                    </span>
                    <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-gray-800 leading-normal">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
