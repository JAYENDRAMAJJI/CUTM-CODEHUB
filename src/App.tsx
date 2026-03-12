import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/auth/Login';
import StudentLogin from './pages/student/auth/Login';
import StudentRegister from './pages/student/auth/Register';
import StudentForgotPassword from './pages/student/auth/ForgotPassword';
import StudentEmailVerification from './pages/student/auth/EmailVerification';
import StudentDashboard from './pages/student/dashboard/Dashboard';
import StudentProfile from './pages/student/account/Profile';
import StudentAchievements from './pages/student/account/Achievements';
import StudentSettings from './pages/student/account/Settings';
import StudentCourses from './pages/student/learning/Courses';
import StudentCourseDetail from './pages/student/learning/CourseDetail';
import StudentCourseVideo from './pages/student/learning/CourseVideo';
import StudentLearningPath from './pages/student/learning/LearningPath';
import StudentTutorials from './pages/student/learning/Tutorials';
import StudentCodingProblems from './pages/student/coding/Problems';
import StudentProblemDetail from './pages/student/coding/ProblemDetail';
import StudentCodeEditor from './pages/student/coding/Editor';
import StudentSubmissions from './pages/student/coding/Submissions';
import StudentContests from './pages/student/competition/Contests';
import StudentContestDetail from './pages/student/competition/ContestDetail';
import StudentContestCoding from './pages/student/competition/ContestCoding';
import StudentLeaderboard from './pages/student/competition/Leaderboard';
import StudentDiscussions from './pages/student/community/Discussions';
import StudentNotifications from './pages/student/community/Notifications';
import StudentSearch from './pages/student/system/Search';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProblems from './pages/admin/Problems';
import AdminProblemCreate from './pages/admin/ProblemCreate';
import AdminProblemEdit from './pages/admin/ProblemEdit';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminCourses from './pages/admin/Courses';
import AdminCourseCreate from './pages/admin/CourseCreate';
import AdminCourseEdit from './pages/admin/CourseEdit';
import AdminContests from './pages/admin/Contests';
import AdminContestCreate from './pages/admin/ContestCreate';
import AdminContestEdit from './pages/admin/ContestEdit';
import AdminContestResults from './pages/admin/ContestResults';
import AdminSubmissions from './pages/admin/Submissions';
import AdminDiscussions from './pages/admin/Discussions';
import AdminNotifications from './pages/admin/Notifications';
import AdminAnalytics from './pages/admin/Analytics';
import AdminLeaderboard from './pages/admin/Leaderboard';
import AdminSettings from './pages/admin/Settings';

type RootErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class RootErrorBoundary extends Component<{ children: ReactNode }, RootErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected application error',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep a console trace for debugging while still showing fallback UI.
    console.error('Root render failure:', error, info);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleClearAndReload = (): void => {
    try {
      window.localStorage.clear();
    } catch {
      // Ignore if storage is unavailable.
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <h1 className="text-xl font-semibold text-slate-900">App failed to load</h1>
            <p className="text-sm text-slate-600">
              A runtime error prevented the page from rendering.
            </p>
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 break-words">
              {this.state.errorMessage}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Clear local data and reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  allowedRole,
  unauthenticatedRedirect,
}: {
  children: React.ReactNode;
  allowedRole: 'STUDENT' | 'ADMIN';
  unauthenticatedRedirect: string;
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to={unauthenticatedRedirect} replace />;
  }
  
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/admin/login" element={!user ? <AdminLogin /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/register" element={!user ? <StudentRegister /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/student/login" element={!user ? <StudentLogin /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/student/register" element={!user ? <StudentRegister /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/student/forgot-password" element={!user ? <StudentForgotPassword /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />
      <Route path="/student/email-verification" element={!user ? <StudentEmailVerification /> : <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'} replace />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="STUDENT" unauthenticatedRedirect="/student/login"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="achievements" element={<StudentAchievements />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:courseId" element={<StudentCourseDetail />} />
        <Route path="courses/:courseId/video/:videoId" element={<StudentCourseVideo />} />
        <Route path="learning-path" element={<StudentLearningPath />} />
        <Route path="tutorials" element={<StudentTutorials />} />
        <Route path="coding-problems" element={<StudentCodingProblems />} />
        <Route path="coding-problems/:problemId" element={<StudentProblemDetail />} />
        <Route path="code-editor" element={<StudentCodeEditor />} />
        <Route path="submissions" element={<StudentSubmissions />} />
        <Route path="contests" element={<StudentContests />} />
        <Route path="contests/:contestId" element={<StudentContestDetail />} />
        <Route path="contests/:contestId/code" element={<StudentContestCoding />} />
        <Route path="leaderboard" element={<StudentLeaderboard />} />
        <Route path="discussions" element={<StudentDiscussions />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="search" element={<StudentSearch />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="practice" element={<Navigate to="/student/coding-problems" replace />} />
        <Route path="discuss" element={<Navigate to="/student/discussions" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN" unauthenticatedRedirect="/admin/login"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUserDetail />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/create" element={<AdminCourseCreate />} />
        <Route path="courses/:courseId/edit" element={<AdminCourseEdit />} />
        <Route path="problems" element={<AdminProblems />} />
        <Route path="problems/create" element={<AdminProblemCreate />} />
        <Route path="problems/:problemId/edit" element={<AdminProblemEdit />} />
        <Route path="contests" element={<AdminContests />} />
        <Route path="contests/create" element={<AdminContestCreate />} />
        <Route path="contests/:contestId/edit" element={<AdminContestEdit />} />
        <Route path="contests/:contestId/results" element={<AdminContestResults />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="discussions" element={<AdminDiscussions />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <RootErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </RootErrorBoundary>
  );
}

