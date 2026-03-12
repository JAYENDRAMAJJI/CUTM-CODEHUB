import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Code, 
  Trophy, 
  FileText, 
  MessageSquare, 
  Bell, 
  BarChart, 
  Medal,
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navSections = [
    {
      title: 'Overview',
      links: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Management',
      links: [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Courses', path: '/admin/courses', icon: BookOpen },
        { name: 'Problems', path: '/admin/problems', icon: Code },
        { name: 'Contests', path: '/admin/contests', icon: Trophy },
        { name: 'Submissions', path: '/admin/submissions', icon: FileText },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Discussions', path: '/admin/discussions', icon: MessageSquare },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      ],
    },
    {
      title: 'Insights',
      links: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
        { name: 'Leaderboard', path: '/admin/leaderboard', icon: Medal },
      ],
    },
    {
      title: 'System',
      links: [
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const allLinks = navSections.flatMap((section) => section.links);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of navSections) {
      initial[section.title] = section.links.some((link) => location.pathname.startsWith(link.path));
    }
    return initial;
  });

  const searchableLinks = useMemo(
    () =>
      allLinks.map((link) => ({
        ...link,
        keywords: [link.name, link.path.replace('/admin/', '')],
      })),
    [allLinks],
  );

  const currentNav = allLinks.find((link) => location.pathname.startsWith(link.path));

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return;
    }

    const matchedLink = searchableLinks.find((link) =>
      link.keywords.some((keyword) => keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())),
    );

    if (!matchedLink) {
      window.alert('No matching admin section found. Try users, courses, problems, contests, submissions, discussions, notifications, analytics, leaderboard, or settings.');
      return;
    }

    navigate(matchedLink.path);
    setSearchQuery('');
    setIsSidebarOpen(false);
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    const activeSection = navSections.find((section) =>
      section.links.some((link) => location.pathname.startsWith(link.path)),
    );
    if (!activeSection) return;

    setOpenSections((prev) => ({ ...prev, [activeSection.title]: true }));
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Admin Panel</span>
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
                onClick={() => toggleSection(section.title)}
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
                        onClick={() => setIsSidebarOpen(false)}
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
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* Topbar */}
        <header className="min-h-[88px] flex items-end justify-between px-4 sm:px-6 lg:px-8 pt-5 pb-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
              {currentNav?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-start gap-4 pb-1">
            <form className="relative" onSubmit={handleSearch}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search admin pages..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-indigo-600"
                title="Search admin pages"
                aria-label="Search admin pages"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6 sm:pt-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
