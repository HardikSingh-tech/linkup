import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import api from '../api/axios';
import { Briefcase, MapPin, Building, Search, CheckCircle, Plus } from 'lucide-react';

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'applied'
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');
  const [applying, setApplying] = useState(false);

  // Post new job modal
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '', company: '', location: '', employmentType: 'Full-time', workplaceType: 'Hybrid', salaryRange: '', description: ''
  });
  const [postingJob, setPostingJob] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=0&size=20`);
      const list = res.data.content || [];
      setJobs(list);
      if (list.length > 0 && !selectedJob) {
        setSelectedJob(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await api.get('/jobs/applied');
      setAppliedJobs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplied();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, { notes: applyNotes });
      setIsApplyModalOpen(false);
      setApplyNotes('');
      // update state
      setSelectedJob(prev => ({ ...prev, appliedByMe: true, applicantCount: prev.applicantCount + 1 }));
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, appliedByMe: true, applicantCount: j.applicantCount + 1 } : j));
      fetchApplied();
    } catch (err) {
      alert('Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      const res = await api.post('/jobs', newJobData);
      setIsPostJobModalOpen(false);
      setNewJobData({ title: '', company: '', location: '', employmentType: 'Full-time', workplaceType: 'Hybrid', salaryRange: '', description: '' });
      fetchJobs();
      setSelectedJob(res.data);
    } catch (err) {
      alert('Failed to post job');
    } finally {
      setPostingJob(false);
    }
  };

  const leftNav = (
    <Card className="p-3 text-xs">
      <h3 className="font-bold text-gray-900 px-3 py-2 border-b border-brand-border">Job Navigator</h3>
      <div className="mt-2 space-y-1">
        <button
          onClick={() => setActiveTab('search')}
          className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
            activeTab === 'search' ? 'bg-brand-light font-bold text-brand-blue' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center"><Search className="w-4 h-4 mr-2" /> Find Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('applied')}
          className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
            activeTab === 'applied' ? 'bg-brand-light font-bold text-brand-blue' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> My Applications</span>
          <span className="text-gray-500 font-semibold">{appliedJobs.length}</span>
        </button>

        <div className="pt-3 border-t border-brand-border">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            icon={Plus}
            onClick={() => setIsPostJobModalOpen(true)}
          >
            Post a free job
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <AppLayout leftCol={leftNav}>
      {activeTab === 'applied' ? (
        <Card className="p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">My Submitted Applications ({appliedJobs.length})</h2>
          {appliedJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Explore open opportunities and submit your profile in one click."
              actionText="Search Jobs"
              onAction={() => setActiveTab('search')}
            />
          ) : (
            <div className="divide-y divide-brand-border">
              {appliedJobs.map(app => (
                <div key={app.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{app.job.title}</h4>
                    <p className="text-[11px] text-gray-600">{app.job.company} • {app.job.location}</p>
                    <span className="text-[10px] text-gray-400">Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Search bar */}
          <Card className="p-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-100 rounded px-3 py-1.5 text-xs">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Title, skill or company"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent text-gray-900 w-full focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center bg-slate-100 rounded px-3 py-1.5 text-xs">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-gray-900 w-full focus:outline-none"
                />
              </div>

              <Button type="submit" size="sm">Search</Button>
            </form>
          </Card>

          {/* Two-Pane Job Browser */}
          <div className="grid grid-cols-12 gap-3 min-h-[500px]">
            {/* Left list pane (5 cols) */}
            <div className="col-span-5 bg-white border border-brand-border rounded-lg overflow-hidden flex flex-col h-[600px]">
              <div className="p-3 border-b border-brand-border font-bold text-xs text-gray-800">
                Jobs based on your profile ({jobs.length})
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-brand-border">
                {loading ? (
                  <div className="py-12 flex justify-center"><Spinner size="md" /></div>
                ) : jobs.length === 0 ? (
                  <p className="text-xs text-gray-400 p-6 text-center">No matching jobs found.</p>
                ) : (
                  jobs.map(j => (
                    <div
                      key={j.id}
                      onClick={() => setSelectedJob(j)}
                      className={`p-3 cursor-pointer transition ${
                        selectedJob?.id === j.id ? 'bg-brand-light border-l-4 border-l-brand-blue' : 'hover:bg-slate-50'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-brand-blue hover:underline">{j.title}</h4>
                      <p className="text-[11px] text-gray-800 font-medium mt-0.5">{j.company}</p>
                      <p className="text-[10px] text-gray-500">{j.location} ({j.workplaceType})</p>
                      {j.appliedByMe && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          Applied
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right detail pane (7 cols) */}
            <div className="col-span-7 bg-white border border-brand-border rounded-lg p-5 overflow-y-auto h-[600px] flex flex-col">
              {selectedJob ? (
                <>
                  <div className="border-b border-brand-border pb-4 mb-4">
                    <h2 className="text-base font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="text-xs text-gray-800 font-semibold mt-1">
                      {selectedJob.company} • {selectedJob.location}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-500 mt-2">
                      <span>{selectedJob.employmentType}</span>
                      <span>•</span>
                      <span>{selectedJob.workplaceType}</span>
                      {selectedJob.salaryRange && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-gray-700">{selectedJob.salaryRange}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{selectedJob.applicantCount} applicants</span>
                    </div>

                    <div className="mt-4">
                      {selectedJob.appliedByMe ? (
                        <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                          <CheckCircle className="w-4 h-4 mr-1.5" /> Applied
                        </span>
                      ) : (
                        <Button size="md" onClick={() => setIsApplyModalOpen(true)}>
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-gray-900 mb-2">About the job</h3>
                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  Select a job to view details
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title={`Apply to ${selectedJob?.company}`}>
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Applying for <strong className="text-gray-900">{selectedJob?.title}</strong>
          </p>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Note to hiring team (optional)</label>
            <textarea
              rows={4}
              value={applyNotes}
              onChange={(e) => setApplyNotes(e.target.value)}
              placeholder="Highlight why your skills make you a strong fit..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button size="sm" disabled={applying} onClick={handleApply}>
              {applying ? <Spinner size="sm" /> : 'Submit Application'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Job Modal */}
      <Modal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} title="Post a free job">
        <form onSubmit={handlePostJob} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={newJobData.title}
              onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Company *</label>
            <input
              type="text"
              required
              value={newJobData.company}
              onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded"
              placeholder="e.g. Acme Labs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                required
                value={newJobData.location}
                onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded"
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Workplace Type</label>
              <select
                value={newJobData.workplaceType}
                onChange={(e) => setNewJobData({ ...newJobData, workplaceType: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded"
              >
                <option>Hybrid</option>
                <option>On-site</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Salary Range</label>
            <input
              type="text"
              value={newJobData.salaryRange}
              onChange={(e) => setNewJobData({ ...newJobData, salaryRange: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded"
              placeholder="e.g. $140,000 - $180,000"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Job Description *</label>
            <textarea
              rows={4}
              required
              value={newJobData.description}
              onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded"
              placeholder="Describe requirements and responsibilities..."
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => setIsPostJobModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={postingJob}>
              {postingJob ? <Spinner size="sm" /> : 'Post Job'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
