import React, { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function EducationModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    school: initialData?.school || '',
    degree: initialData?.degree || '',
    fieldOfStudy: initialData?.fieldOfStudy || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData, initialData?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Education' : 'Add Education'}>
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">School *</label>
          <input
            type="text"
            required
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            placeholder="e.g. Stanford University"
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Degree</label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="e.g. Master of Science"
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Field of Study</label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
            placeholder="e.g. Computer Science"
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
