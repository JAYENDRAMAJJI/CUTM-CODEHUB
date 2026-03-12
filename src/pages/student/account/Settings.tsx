import { useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import { Bell, Code, Shield, Moon, Save } from 'lucide-react';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      title={label}
      aria-label={label}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
        checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
      }`} />
    </button>
  );
}

export default function StudentSettings() {
  const [settings, setSettings] = useState({
    darkHints: true,
    emailNotifications: true,
    contestReminders: true,
    courseUpdates: true,
    darkMode: false,
    autoSave: true,
    codeCompletion: true,
    showLineNumbers: true,
    twoFactor: false,
    publicProfile: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const section = (title: string, icon: React.ReactNode, items: { key: keyof typeof settings; label: string; desc?: string }[]) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
        {icon}
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <label key={item.key} className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50">
            <div>
              <p className="text-sm text-slate-800">{item.label}</p>
              {item.desc && <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>}
            </div>
            <Toggle checked={settings[item.key]} onChange={() => toggle(item.key)} label={item.label} />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <StudentPageFrame title="Settings" subtitle="Customize your learning experience and preferences.">
      <div className="space-y-5">
        {section('Notifications', <Bell className="w-4 h-4 text-indigo-500" />, [
          { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive platform updates via email' },
          { key: 'contestReminders', label: 'Contest reminders', desc: 'Get reminded before contests start' },
          { key: 'courseUpdates', label: 'Course updates', desc: 'Notify on new videos and articles' },
        ])}

        {section('Code Editor', <Code className="w-4 h-4 text-emerald-500" />, [
          { key: 'darkHints', label: 'Coding hints', desc: 'Show hints and suggestions while coding' },
          { key: 'autoSave', label: 'Auto save', desc: 'Automatically save your code progress' },
          { key: 'codeCompletion', label: 'Code completion', desc: 'Enable intelligent code autocomplete' },
          { key: 'showLineNumbers', label: 'Line numbers', desc: 'Show line numbers in the editor' },
        ])}

        {section('Appearance', <Moon className="w-4 h-4 text-slate-500" />, [
          { key: 'darkMode', label: 'Dark mode', desc: 'Switch to dark theme (coming soon)' },
        ])}

        {section('Privacy & Security', <Shield className="w-4 h-4 text-amber-500" />, [
          { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Add an extra layer of account security' },
          { key: 'publicProfile', label: 'Public profile', desc: 'Allow others to view your profile and stats' },
        ])}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </StudentPageFrame>
  );
}
