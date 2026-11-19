import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import SuggestionsWidget from '../components/SuggestionsWidget';
import EditProfileModal from '../components/EditProfileModal';
import ExperienceModal from '../components/ExperienceModal';
import EducationModal from '../components/EducationModal';
import SkillModal from '../components/SkillModal';
import { useAuthStore } from '../store/authStore';
import { formatDateRange } from '../utils/dateUtils';
import api from '../api/axios';
import { Edit3, Plus, Trash2, MapPin, Briefcase, GraduationCap, Award, MessageCircle, UserPlus, Check } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateCurrentUser } = useAuthStore();

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${id}`);
      setProfileData(res.data);

      const postsRes = await api.get(`/posts/user/${id}?page=0&size=5`);
      setUserPosts(postsRes.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
      </AppLayout>
    );
  }

  if (!profileData) {
    return (
      <AppLayout>
        <Card className="p-8 text-center"><p>Profile not found</p></Card>
      </AppLayout>
    );
  }

  const { user, experiences, educations, skills, connectionCount, connectionStatus, connectionId } = profileData;
  const isSelf = profileData.connectionStatus === 'SELF' || currentUser?.id === user?.id;

  const handleConnectAction = async () => {
    try {
      if (connectionStatus === 'RECEIVED' && connectionId) {
        await api.put(`/connections/${connectionId}/accept`);
      } else if (connectionStatus === 'NONE') {
        await api.post(`/connections/request/${user.id}`);
      }
      fetchProfile();
    } catch (err) {
      alert('Connection action failed');
    }
  };

  const handleUpdateProfile = async (formData) => {
    const res = await api.put(`/users/${user.id}`, formData);
    updateCurrentUser(res.data);
    fetchProfile();
  };

  const handleSaveExp = async (data, expId) => {
    if (expId) {
      await api.put(`/users/me/experiences/${expId}`, data);
    } else {
      await api.post('/users/me/experiences', data);
    }
    fetchProfile();
  };

  const handleDeleteExp = async (expId) => {
    if (confirm('Delete this experience?')) {
      await api.delete(`/users/me/experiences/${expId}`);
      fetchProfile();
    }
  };

  const handleSaveEdu = async (data, eduId) => {
    if (eduId) {
      await api.put(`/users/me/educations/${eduId}`, data);
    } else {
      await api.post('/users/me/educations', data);
    }
    fetchProfile();
  };

  const handleDeleteEdu = async (eduId) => {
    if (confirm('Delete this education?')) {
      await api.delete(`/users/me/educations/${eduId}`);
      fetchProfile();
    }
  };

  const handleAddSkill = async (data) => {
    await api.post('/users/me/skills', data);
    fetchProfile();
  };

  const handleDeleteSkill = async (skillId) => {
    await api.delete(`/users/me/skills/${skillId}`);
    fetchProfile();
  };

  return (
    <AppLayout rightCol={<SuggestionsWidget />}>
      {/* Profile Header Card */}
      <Card className="relative overflow-hidden mb-3">
        {/* Banner */}
        <div className="h-36 w-full bg-gradient-to-r from-blue-700 to-indigo-900 overflow-hidden">
          {user.bannerUrl && (
            <img src={user.bannerUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <Avatar
              src={user.avatarUrl}
              name={`${user.firstName} ${user.lastName}`}
              size="xxl"
              className="border-4 border-white shadow"
            />
            {isSelf && (
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-gray-600 transition"
                title="Edit profile"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-gray-700 mt-1 leading-normal">{user.headline}</p>

            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{user.location || 'Location not specified'}</span>
              <span>•</span>
              <span className="text-brand-blue font-semibold">{connectionCount} connections</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-4">
              {!isSelf ? (
                <>
                  {connectionStatus === 'NONE' && (
                    <Button variant="primary" size="md" icon={UserPlus} onClick={handleConnectAction}>
                      Connect
                    </Button>
                  )}
                  {connectionStatus === 'PENDING' && (
                    <span className="inline-flex items-center text-xs font-semibold px-4 py-1.5 bg-gray-100 rounded-full text-gray-600">
                      Pending Request
                    </span>
                  )}
                  {connectionStatus === 'RECEIVED' && (
                    <Button variant="primary" size="md" icon={Check} onClick={handleConnectAction}>
                      Accept Invitation
                    </Button>
                  )}
                  {connectionStatus === 'ACCEPTED' && (
                    <span className="inline-flex items-center text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                      <Check className="w-3.5 h-3.5 mr-1" /> Connected
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="md"
                    icon={MessageCircle}
                    onClick={() => navigate('/messaging')}
                  >
                    Message
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* About Card */}
      {user.about && (
        <Card className="p-5 mb-3">
          <h2 className="text-base font-bold text-gray-900 mb-2">About</h2>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{user.about}</p>
        </Card>
      )}

      {/* Experience Card */}
      <Card className="p-5 mb-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-gray-600" /> Experience
          </h2>
          {isSelf && (
            <button
              onClick={() => { setSelectedExp(null); setIsExpModalOpen(true); }}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {experiences.length === 0 ? (
          <p className="text-xs text-gray-400">No experience added yet.</p>
        ) : (
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="flex justify-between items-start border-b border-brand-border pb-3 last:border-none last:pb-0">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-xs text-gray-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                </div>
                {isSelf && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => { setSelectedExp(exp); setIsExpModalOpen(true); }}
                      className="p-1 hover:text-brand-blue text-gray-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-1 hover:text-red-600 text-gray-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Education Card */}
      <Card className="p-5 mb-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-gray-600" /> Education
          </h2>
          {isSelf && (
            <button
              onClick={() => { setSelectedEdu(null); setIsEduModalOpen(true); }}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {educations.length === 0 ? (
          <p className="text-xs text-gray-400">No education added yet.</p>
        ) : (
          <div className="space-y-4">
            {educations.map(edu => (
              <div key={edu.id} className="flex justify-between items-start border-b border-brand-border pb-3 last:border-none last:pb-0">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">{edu.school}</h3>
                  <p className="text-xs text-gray-700">
                    {edu.degree} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDateRange(edu.startDate, edu.endDate, false)}
                  </p>
                </div>
                {isSelf && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => { setSelectedEdu(edu); setIsEduModalOpen(true); }}
                      className="p-1 hover:text-brand-blue text-gray-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEdu(edu.id)}
                      className="p-1 hover:text-red-600 text-gray-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Skills Card */}
      <Card className="p-5 mb-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <Award className="w-4 h-4 mr-2 text-gray-600" /> Skills
          </h2>
          {isSelf && (
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-gray-400">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span
                key={s.id}
                className="inline-flex items-center text-xs font-semibold px-3 py-1 bg-slate-100 text-gray-800 rounded-full border border-slate-200"
              >
                {s.name}
                {isSelf && (
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="ml-1.5 text-gray-400 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Posts Section */}
      {userPosts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 px-1">Recent Activity</h2>
          {userPosts.map(p => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profileUser={user}
        onSave={handleUpdateProfile}
      />
      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        initialData={selectedExp}
        onSave={handleSaveExp}
      />
      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        initialData={selectedEdu}
        onSave={handleSaveEdu}
      />
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleAddSkill}
      />
    </AppLayout>
  );
}
