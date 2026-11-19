import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import ProfileCard from '../components/ProfileCard';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import SuggestionsWidget from '../components/SuggestionsWidget';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import api from '../api/axios';
import { Newspaper } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = async (pageNumber = 0, append = false) => {
    if (pageNumber === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await api.get(`/posts/feed?page=${pageNumber}&size=10`);
      const data = res.data;
      if (append) {
        setPosts(prev => [...prev, ...data.content]);
      } else {
        setPosts(data.content);
      }
      setHasMore(!data.last);
      setPage(data.pageNumber);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(0, false);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  return (
    <AppLayout
      leftCol={<ProfileCard />}
      rightCol={<SuggestionsWidget />}
    >
      {/* Center Post Composer */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Posts List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts in your feed yet"
          description="Connect with more people or publish your first update to see rich professional content."
        />
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}

          {hasMore && (
            <div className="pt-2 pb-6 flex justify-center">
              <button
                onClick={() => fetchFeed(page + 1, true)}
                disabled={loadingMore}
                className="px-6 py-2 text-xs font-semibold rounded-full border border-gray-400 text-gray-700 bg-white hover:bg-gray-50 transition shadow-xs"
              >
                {loadingMore ? <Spinner size="sm" /> : 'Load more posts'}
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
