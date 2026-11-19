import React, { useState, useRef } from 'react';
import Card from './Card';
import Avatar from './Avatar';
import Button from './Button';
import Modal from './Modal';
import Spinner from './Spinner';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Image, X } from 'lucide-react';

export default function PostComposer({ onPostCreated }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // backend returns { url: "/uploads/xyz.png" }
      setMediaUrl(`http://localhost:8080${res.data.url}`);
    } catch (err) {
      alert('Failed to upload image. Max 5MB JPG, PNG, WEBP.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setSubmitting(true);
    try {
      const res = await api.post('/posts', {
        content: content.trim(),
        mediaUrl: mediaUrl || null,
      });
      setContent('');
      setMediaUrl('');
      setIsModalOpen(false);
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      alert('Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className="flex items-center space-x-3">
          <Avatar src={user?.avatarUrl} name={`${user?.firstName} ${user?.lastName}`} size="md" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-500 text-xs font-semibold transition"
          >
            Start a post, Hardik...
          </button>
        </div>

        <div className="flex justify-around items-center pt-2 mt-2 border-t border-brand-border">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded hover:bg-slate-100 text-gray-600 text-xs font-semibold transition"
          >
            <Image className="w-5 h-5 text-blue-500" />
            <span>Media</span>
          </button>
        </div>
      </Card>

      {/* Post Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a post">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar src={user?.avatarUrl} name={`${user?.firstName} ${user?.lastName}`} size="md" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h4>
            <span className="text-[11px] text-gray-500">Post to Anyone</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full text-sm text-gray-900 border-none resize-none focus:outline-none placeholder-gray-400"
            autoFocus
          />

          {uploading && (
            <div className="py-4 flex items-center justify-center space-x-2 text-xs text-brand-blue">
              <Spinner size="sm" />
              <span>Uploading media...</span>
            </div>
          )}

          {mediaUrl && (
            <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-200">
              <img src={mediaUrl} alt="Attached" className="max-h-60 w-full object-cover" />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={(!content.trim() && !mediaUrl) || submitting}
              className="px-5 py-1.5"
            >
              {submitting ? <Spinner size="sm" /> : 'Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
