import React, { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function EditProfileModal({ isOpen, onClose, profileUser, onSave }) {
  const [formData, setFormData] = useState({
    firstName: profileUser?.firstName || '',
    lastName: profileUser?.lastName || '',
    headline: profileUser?.headline || '',
    location: profileUser?.location || '',
    about: profileUser?.about || '',
    avatarUrl: profileUser?.avatarUrl || '',
    bannerUrl: profileUser?.bannerUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit intro & profile">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">First name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Last name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">About</label>
          <textarea
            name="about"
            rows={4}
            value={formData.about}
            onChange={handleChange}
            placeholder="Write a summary about yourself..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Avatar Image URL</label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Banner Image URL</label>
          <input
            type="text"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
