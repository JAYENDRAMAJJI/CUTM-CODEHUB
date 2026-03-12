import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  Code,
  Trophy,
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  Bell,
  Search,
  Settings,
  NotebookTabs,
  FileText,
  Braces,
  Medal,
  Award,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { type ComponentType, useEffect, useState } from 'react';

type NavLinkItem = {
  name: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

type NavSection = {
  title: string;
  links: NavLinkItem[];
};

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAvatarImage, setShowAvatarImage] = useState(true);

  const navSections: NavSection[] = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Profile', path: '/student/profile', icon: User },
        { name: 'Achievements', path: '/student/achievements', icon: Award },
      ],
    },
    {
      title: 'Learning',
      links: [
        { name: 'Courses', path: '/student/courses', icon: BookOpen },
        { name: 'Learning Path', path: '/student/learning-path', icon: GraduationCap },
        { name: 'Tutorials', path: '/student/tutorials', icon: NotebookTabs },
      ],
    },
    {
      title: 'Coding',
      links: [
        { name: 'Problems', path: '/student/coding-problems', icon: Code },
        { name: 'Editor', path: '/student/code-editor', icon: Braces },
        { name: 'Submissions', path: '/student/submissions', icon: FileText },
        { name: 'Contests', path: '/student/contests', icon: Trophy },
        { name: 'Leaderboard', path: '/student/leaderboard', icon: Medal },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Discussions', path: '/student/discussions', icon: MessageSquare },
        { name: 'Notifications', path: '/student/notifications', icon: Bell },
      ],
    },
    {
      title: 'System',
      links: [
        { name: 'Search', path: '/student/search', icon: Search },
        { name: 'Settings', path: '/student/settings', icon: Settings },
      ],
    },
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of navSections) {
      initial[section.title] = section.links.some((link) => location.pathname.startsWith(link.path));
    }
    return initial;
  });

  const currentNav = navSections
    .flatMap((section) => section.links)
    .find((item) => location.pathname.startsWith(item.path));

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Always keep the current route's parent section expanded.
    const activeSection = navSections.find((section) =>
      section.links.some((link) => location.pathname.startsWith(link.path)),
    );
    if (!activeSection) return;

    setOpenSections((prev) => ({ ...prev, [activeSection.title]: true }));
  }, [location.pathname]);

  useEffect(() => {
    setShowAvatarImage(Boolean(user?.avatar));
  }, [user?.avatar]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-72 bg-slate-900 text-slate-300
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
          <Link to="/student/dashboard" className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-sm">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white leading-none">CodeLearn</p>
              <p className="text-[11px] text-slate-400 mt-1">Student Workspace</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => setOpenSections((prev) => ({ ...prev, [section.title]: !prev[section.title] }))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-wider"
              >
                <span>{section.title}</span>
                {openSections[section.title] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections[section.title] && (
                <div className="space-y-1.5 mt-2 pl-1">
                  {section.links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`
                          flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                          ${isActive
                            ? 'bg-indigo-600 text-white border border-indigo-500'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}
                        `}
                      >
                        <link.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
            {showAvatarImage ? (
              <img
                src={user?.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
                referrerPolicy="no-referrer"
                onError={() => setShowAvatarImage(false)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200">
                {(user?.name?.charAt(0) || 'S').toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">Student</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="min-h-[100px] flex items-end justify-between px-4 sm:px-6 lg:px-8 pt-5 pb-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                <span>Student</span>
                <ChevronRight className="w-3 h-3" />
                <span className="truncate">{currentNav?.name || 'Dashboard'}</span>
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                {currentNav?.name || 'Dashboard'}
              </h1>
              <p className="hidden sm:block text-xs text-slate-500">Practice consistently and track your progress</p>
            </div>
          </div>
          <div className="hidden md:flex items-start gap-4 pb-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search modules"
                className="w-48 lg:w-72 pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {Math.max(1, user?.name?.length ?? 1)}
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-6 pt-6 sm:pt-7">
          <div className="w-full max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
