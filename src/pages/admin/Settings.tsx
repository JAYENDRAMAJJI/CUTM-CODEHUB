import { useEffect, useState } from 'react';
import { Save, ShieldCheck, Globe, BellRing } from 'lucide-react';
import { getSettings, saveSettings } from '../../data/adminApi';

export default function AdminSettings() {
  const [platformName, setPlatformName] = useState('CodeLearn');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [moderationAutoFilter, setModerationAutoFilter] = useState(true);
  const [plagiarismAutoCheck, setPlagiarismAutoCheck] = useState(true);
  const [maxSubmissionsPerDay, setMaxSubmissionsPerDay] = useState(100);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(120);
  const [backupFrequency, setBackupFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  useEffect(() => {
    const saved = getSettings();
    setPlatformName(saved.platformName);
    setAllowRegistration(saved.allowRegistration);
    setEmailAlerts(saved.emailAlerts);
    setMaintenanceMode(saved.maintenanceMode);
    setModerationAutoFilter(saved.moderationAutoFilter);
    setPlagiarismAutoCheck(saved.plagiarismAutoCheck);
    setMaxSubmissionsPerDay(saved.maxSubmissionsPerDay);
    setSessionTimeoutMinutes(saved.sessionTimeoutMinutes);
    setBackupFrequency(saved.backupFrequency);
  }, []);

  const onSave = () => {
    saveSettings({
      platformName,
      allowRegistration,
      emailAlerts,
      maintenanceMode,
      moderationAutoFilter,
      plagiarismAutoCheck,
      maxSubmissionsPerDay,
      sessionTimeoutMinutes,
      backupFrequency,
    });
    window.alert('Settings saved successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-1">Configure global platform behavior and admin defaults.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            General
          </h2>

          <div>
            <label htmlFor="platform-name" className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
            <input
              id="platform-name"
              title="Platform Name"
              placeholder="Enter platform name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm text-slate-700">Allow New Registration</span>
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm text-slate-700">Maintenance Mode</span>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <div>
            <label htmlFor="backup-frequency" className="block text-sm font-medium text-slate-700 mb-1">Backup Frequency</label>
            <select
              id="backup-frequency"
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value as 'Daily' | 'Weekly' | 'Monthly')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security & Alerts
          </h2>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm text-slate-700">Email Admin On Critical Errors</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm text-slate-700">Auto Filter Inappropriate Content</span>
            <input
              type="checkbox"
              checked={moderationAutoFilter}
              onChange={(e) => setModerationAutoFilter(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="text-sm text-slate-700">Auto Plagiarism Check</span>
            <input
              type="checkbox"
              checked={plagiarismAutoCheck}
              onChange={(e) => setPlagiarismAutoCheck(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="max-submissions" className="block text-sm font-medium text-slate-700 mb-1">Max Submissions / Day</label>
              <input
                id="max-submissions"
                type="number"
                min={1}
                value={maxSubmissionsPerDay}
                onChange={(e) => setMaxSubmissionsPerDay(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="session-timeout" className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (min)</label>
              <input
                id="session-timeout"
                type="number"
                min={5}
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Math.max(5, Number(e.target.value) || 5))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600 inline-flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-600" />
            Last backup synced 2 hours ago ({backupFrequency} policy).
          </div>
        </section>
      </div>

      <div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
          onClick={onSave}
          title="Save settings"
          aria-label="Save settings"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
