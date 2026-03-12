import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import StudentPageFrame from '../components/StudentPageFrame';
import { Edit2, Save, X, Code, Trophy, Flame, Award, BookOpen } from 'lucide-react';

const BADGES = [
  { label: 'First Solve', icon: '🎯', earned: true },
  { label: 'Streak 7', icon: '🔥', earned: true },
  { label: 'Century', icon: '💯', earned: false },
  { label: 'Speed Demon', icon: '⚡', earned: true },
];

function progressWidthClass(percent: number) {
  if (percent >= 90) return 'w-[90%]';
  if (percent >= 80) return 'w-[80%]';
  if (percent >= 70) return 'w-[70%]';
  if (percent >= 60) return 'w-[60%]';
  if (percent >= 50) return 'w-[50%]';
  if (percent >= 40) return 'w-[40%]';
  if (percent >= 30) return 'w-[30%]';
  if (percent >= 20) return 'w-[20%]';
  if (percent > 0) return 'w-[10%]';
  return 'w-0';
}

export default function StudentProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? 'Alex Student');
  const [bio, setBio] = useState('Passionate coder focused on DSA and backend development.');
  const [track, setTrack] = useState('DSA + Web');
  const [savedName, setSavedName] = useState(name);
  const [savedBio, setSavedBio] = useState(bio);
  const [savedTrack, setSavedTrack] = useState(track);

  const handleSave = () => {
    setSavedName(name);
    setSavedBio(bio);
    setSavedTrack(track);
    setEditing(false);
  };

  const handleCancel = () => {
    setName(savedName);
    setBio(savedBio);
    setTrack(savedTrack);
    setEditing(false);
  };

  return (
    <StudentPageFrame title="Profile" subtitle="View and manage your student profile.">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {savedName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Display Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} title="Display Name" placeholder="Your name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} title="Bio" placeholder="Tell others about your goals" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Learning Track</label>
                  <input value={track} onChange={(e) => setTrack(e.target.value)} title="Learning Track" placeholder="Ex: DSA + Web" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{savedName}</h2>
                    <p className="text-sm text-slate-500">{user?.email ?? 'alex@example.com'}</p>
                  </div>
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 mt-0.5">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <p className="text-sm text-slate-600 mt-2">{savedBio}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{savedTrack}</span>
              </div>
            )}
          </div>
        </div>

        {/* Coding Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2"><Code className="w-5 h-5 text-indigo-500" /></div>
            <p className="text-2xl font-bold text-slate-900">47</p>
            <p className="text-xs text-slate-500 mt-0.5">Problems Solved</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2"><Flame className="w-5 h-5 text-orange-500" /></div>
            <p className="text-2xl font-bold text-slate-900">14</p>
            <p className="text-xs text-slate-500 mt-0.5">Day Streak</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2"><Trophy className="w-5 h-5 text-amber-500" /></div>
            <p className="text-2xl font-bold text-slate-900">1520</p>
            <p className="text-xs text-slate-500 mt-0.5">Contest Rating</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2"><BookOpen className="w-5 h-5 text-sky-500" /></div>
            <p className="text-2xl font-bold text-slate-900">3</p>
            <p className="text-xs text-slate-500 mt-0.5">Courses Enrolled</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Solved by Difficulty</h3>
          <div className="space-y-3">
            {[
              { label: 'Easy', solved: 30, total: 40, color: 'bg-emerald-400', textColor: 'text-emerald-600' },
              { label: 'Medium', solved: 14, total: 35, color: 'bg-amber-400', textColor: 'text-amber-600' },
              { label: 'Hard', solved: 3, total: 20, color: 'bg-red-400', textColor: 'text-red-600' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`font-medium ${item.textColor}`}>{item.label}</span>
                  <span className="text-slate-500">{item.solved}/{item.total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full ${progressWidthClass((item.solved / item.total) * 100)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Badges &amp; Achievements</h3>
            <Link to="/student/achievements" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> View all
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((badge) => (
              <div key={badge.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${
                badge.earned ? 'border-indigo-200 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}>
                <span className={badge.earned ? '' : 'grayscale opacity-50'}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentPageFrame>
  );
}
