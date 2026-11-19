import React, { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function SkillModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim() });
      setName('');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Skill">
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Skill name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Distributed Systems, Kubernetes, React"
            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
          />
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
