import { nextId, readStore, writeStore } from './admin/storage';
import type {
  AdminContest,
  AdminCourse,
  AdminDiscussion,
  AdminDiscussionComment,
  AdminProblem,
  AdminSettings,
  AdminSubmission,
  AdminUser,
  AdminUserActivity,
  AdminUserActivityType,
  ContestResult,
  ContestStatus,
  CourseLevel,
  CourseStatus,
  LeaderboardEntry,
  NotificationStatus,
  NotificationTemplate,
  ProblemDifficulty,
  ProblemStatus,
  ProblemTestCase,
  ScoringSystem,
  SubmissionCheatingFlag,
  SubmissionVerdict,
  UserRole,
  UserStatus,
} from './admin/types';

export type {
  AdminContest,
  AdminCourse,
  AdminDiscussion,
  AdminDiscussionComment,
  AdminProblem,
  AdminSettings,
  AdminSubmission,
  AdminUser,
  AdminUserActivity,
  AdminUserActivityType,
  ContestResult,
  ContestStatus,
  CourseLevel,
  CourseStatus,
  LeaderboardEntry,
  NotificationStatus,
  NotificationTemplate,
  ProblemDifficulty,
  ProblemStatus,
  ProblemTestCase,
  ScoringSystem,
  SubmissionCheatingFlag,
  SubmissionVerdict,
  UserRole,
  UserStatus,
} from './admin/types';

type LegacyAdminContest = {
  id: string;
  title: string;
  startAt: string;
  duration?: string;
  durationMinutes?: number;
  problemIds?: string[];
  participants: number;
  status: ContestStatus;
};

type LegacyAdminSubmission = {
  id: string;
  user: string;
  problem: string;
  language: string;
  verdict: SubmissionVerdict;
  submittedAt: string;
  plagiarismScore?: number;
  plagiarismDetected?: boolean;
  cheatingFlags?: SubmissionCheatingFlag[];
  contestId?: string;
  codeFingerprint?: string;
};

type LegacyAdminDiscussion = {
  id: string;
  title: string;
  author: string;
  replies: number;
  flagged: boolean;
  category: string;
  spam?: boolean;
  comments?: AdminDiscussionComment[];
};

type LegacyNotificationTemplate = {
  id: string;
  title: string;
  message?: string;
  audience: string;
  channel: string;
  status: NotificationStatus | 'Active';
  scheduledFor?: string;
  createdAt?: string;
  deliveredCount?: number;
};

type LegacyAdminSettings = Partial<AdminSettings>;

type LegacyLeaderboardEntry = {
  rank?: number;
  user: string;
  score: number;
  solved?: number;
  penalties?: number;
};

const KEY_USERS = 'admin.users';
const KEY_COURSES = 'admin.courses';
const KEY_PROBLEMS = 'admin.problems';
const KEY_CONTESTS = 'admin.contests';
const KEY_SUBMISSIONS = 'admin.submissions';
const KEY_DISCUSSIONS = 'admin.discussions';
const KEY_BANNED_DISCUSSION_USERS = 'admin.discussion.bannedUsers';
const KEY_NOTIFICATIONS = 'admin.notifications';
const KEY_SETTINGS = 'admin.settings';
const KEY_USER_ACTIVITY = 'admin.userActivity';
const KEY_LEADERBOARD = 'admin.leaderboard';
const KEY_SCORING_SYSTEM = 'admin.leaderboard.scoring';

const userSeed: AdminUser[] = [
  { id: 'USR-1001', name: 'Alex Student', email: 'alex@example.com', role: 'Student', status: 'Active', joinedOn: 'Jan 03, 2026' },
  { id: 'USR-1002', name: 'Sarah Admin', email: 'admin@example.com', role: 'Admin', status: 'Active', joinedOn: 'Dec 14, 2025' },
  { id: 'USR-1003', name: 'Priya Sharma', email: 'priya@example.com', role: 'Student', status: 'Suspended', joinedOn: 'Jan 28, 2026' },
  { id: 'USR-1004', name: 'Rohit Das', email: 'rohit@example.com', role: 'Student', status: 'Active', joinedOn: 'Feb 02, 2026' },
  { id: 'USR-1005', name: 'Nina Paul', email: 'nina@example.com', role: 'Student', status: 'Active', joinedOn: 'Feb 08, 2026' },
];

const courseSeed: AdminCourse[] = [
  {
    id: 'CRS-201',
    title: 'DSA Foundations',
    level: 'Beginner',
    enrolled: 1240,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/dsa/intro.mp4'],
    articles: ['https://codelearn.dev/articles/dsa-basics'],
  },
  {
    id: 'CRS-202',
    title: 'Dynamic Programming Mastery',
    level: 'Advanced',
    enrolled: 430,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/dp/state-transitions.mp4'],
    articles: ['https://codelearn.dev/articles/dp-patterns'],
  },
  {
    id: 'CRS-203',
    title: 'Graphs and Trees',
    level: 'Intermediate',
    enrolled: 760,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/graphs/bfs-dfs.mp4'],
    articles: ['https://codelearn.dev/articles/graph-traversal'],
  },
  {
    id: 'CRS-204',
    title: 'System Design Basics',
    level: 'Intermediate',
    enrolled: 0,
    status: 'Draft',
    videos: [],
    articles: [],
  },
  {
    id: 'CRS-205',
    title: 'Greedy Patterns',
    level: 'Beginner',
    enrolled: 510,
    status: 'Draft',
    videos: [],
    articles: [],
  },
  {
    id: 'CRS-206',
    title: 'Binary Search Techniques',
    level: 'Beginner',
    enrolled: 890,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/binary-search/intro.mp4', 'https://videos.codelearn.dev/binary-search/advanced.mp4'],
    articles: ['https://codelearn.dev/articles/binary-search-basics', 'https://codelearn.dev/articles/binary-search-variants'],
  },
  {
    id: 'CRS-207',
    title: 'Sorting Algorithms Deep Dive',
    level: 'Beginner',
    enrolled: 1120,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/sorting/merge-sort.mp4', 'https://videos.codelearn.dev/sorting/quick-sort.mp4'],
    articles: ['https://codelearn.dev/articles/sorting-overview'],
  },
  {
    id: 'CRS-208',
    title: 'Recursion & Backtracking',
    level: 'Intermediate',
    enrolled: 670,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/recursion/intro.mp4', 'https://videos.codelearn.dev/recursion/backtracking.mp4'],
    articles: ['https://codelearn.dev/articles/recursion-patterns', 'https://codelearn.dev/articles/backtracking-guide'],
  },
  {
    id: 'CRS-209',
    title: 'Bit Manipulation',
    level: 'Intermediate',
    enrolled: 320,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/bits/basics.mp4'],
    articles: ['https://codelearn.dev/articles/bit-tricks'],
  },
  {
    id: 'CRS-210',
    title: 'Advanced Graph Algorithms',
    level: 'Advanced',
    enrolled: 215,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/graphs/dijkstra.mp4', 'https://videos.codelearn.dev/graphs/floyd-warshall.mp4'],
    articles: ['https://codelearn.dev/articles/shortest-paths', 'https://codelearn.dev/articles/mst'],
  },
  {
    id: 'CRS-211',
    title: 'Competitive Programming Fundamentals',
    level: 'Beginner',
    enrolled: 1540,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/cp/getting-started.mp4', 'https://videos.codelearn.dev/cp/io-optimization.mp4'],
    articles: ['https://codelearn.dev/articles/cp-intro', 'https://codelearn.dev/articles/stl-essentials'],
  },
  {
    id: 'CRS-212',
    title: 'Segment Trees & Fenwick Trees',
    level: 'Advanced',
    enrolled: 188,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/ds/segment-tree.mp4', 'https://videos.codelearn.dev/ds/fenwick-tree.mp4'],
    articles: ['https://codelearn.dev/articles/segment-tree-update', 'https://codelearn.dev/articles/bit-range-query'],
  },
  {
    id: 'CRS-213',
    title: 'String Algorithms',
    level: 'Intermediate',
    enrolled: 405,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/strings/kmp.mp4', 'https://videos.codelearn.dev/strings/z-function.mp4'],
    articles: ['https://codelearn.dev/articles/string-hashing', 'https://codelearn.dev/articles/trie-basics'],
  },
  {
    id: 'CRS-214',
    title: 'Number Theory for CP',
    level: 'Advanced',
    enrolled: 0,
    status: 'Draft',
    videos: [],
    articles: [],
  },
  {
    id: 'CRS-215',
    title: 'Object Oriented Programming in Java',
    level: 'Beginner',
    enrolled: 2300,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/java/oop-intro.mp4', 'https://videos.codelearn.dev/java/inheritance.mp4', 'https://videos.codelearn.dev/java/polymorphism.mp4'],
    articles: ['https://codelearn.dev/articles/java-oop', 'https://codelearn.dev/articles/java-interfaces'],
  },
  {
    id: 'CRS-216',
    title: 'Python for Data Structures',
    level: 'Beginner',
    enrolled: 1875,
    status: 'Published',
    videos: ['https://videos.codelearn.dev/python/lists-dicts.mp4', 'https://videos.codelearn.dev/python/heaps-sets.mp4'],
    articles: ['https://codelearn.dev/articles/python-collections', 'https://codelearn.dev/articles/python-sorting'],
  },
  {
    id: 'CRS-217',
    title: 'Database Design & SQL',
    level: 'Intermediate',
    enrolled: 0,
    status: 'Draft',
    videos: [],
    articles: [],
  },
];

const problemSeed: AdminProblem[] = [
  {
    id: 'PROB-1001',
    title: 'Two Sum',
    difficulty: 'Easy',
    author: 'Admin Sarah',
    created: 'Oct 12, 2023',
    status: 'Published',
    description: 'Given an array of integers, return indices of two numbers such that they add up to a target.',
    inputFormat: 'First line contains integer n and target. Second line contains n integers.',
    outputFormat: 'Return two indices separated by space.',
    constraints: '2 <= n <= 10^5, -10^9 <= nums[i], target <= 10^9',
    testCases: [{ input: '4 9\n2 7 11 15', output: '0 1' }],
  },
  {
    id: 'PROB-1002',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    author: 'Admin Sarah',
    created: 'Oct 15, 2023',
    status: 'Published',
    description: 'Add two non-empty linked lists representing non-negative integers.',
    inputFormat: 'Two lines represent two linked lists in reverse order.',
    outputFormat: 'A linked list in reverse order.',
    constraints: 'Length <= 100, values between 0 and 9.',
    testCases: [{ input: '2 4 3\n5 6 4', output: '7 0 8' }],
  },
  {
    id: 'PROB-1003',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    author: 'Admin Sarah',
    created: 'Oct 18, 2023',
    status: 'Draft',
    description: 'Find the length of the longest substring without repeating characters.',
    inputFormat: 'Single string s.',
    outputFormat: 'Single integer length.',
    constraints: '0 <= |s| <= 10^5',
    testCases: [{ input: 'abcabcbb', output: '3' }],
  },
  {
    id: 'PROB-1004',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    author: 'Admin Sarah',
    created: 'Oct 20, 2023',
    status: 'Published',
    description: 'Find median of two sorted arrays.',
    inputFormat: 'Two lines, each containing sorted array elements.',
    outputFormat: 'Median value as number.',
    constraints: '0 <= m,n <= 1000',
    testCases: [{ input: '1 3\n2', output: '2.0' }],
  },
  {
    id: 'PROB-1005',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    author: 'Admin Sarah',
    created: 'Oct 22, 2023',
    status: 'Draft',
    description: 'Return longest palindromic substring in s.',
    inputFormat: 'String s.',
    outputFormat: 'Longest palindrome substring.',
    constraints: '1 <= |s| <= 1000',
    testCases: [{ input: 'babad', output: 'bab' }],
  },
];

const contestSeed: AdminContest[] = [
  {
    id: 'CNT-5001',
    title: 'Weekly Challenge 41',
    startAt: 'Mar 15, 2026 7:00 PM',
    durationMinutes: 120,
    problemIds: ['PROB-1001', 'PROB-1002', 'PROB-1003'],
    participants: 842,
    status: 'Upcoming',
  },
  {
    id: 'CNT-5000',
    title: 'Algo Sprint March',
    startAt: 'Mar 10, 2026 8:00 PM',
    durationMinutes: 90,
    problemIds: ['PROB-1001', 'PROB-1004', 'PROB-1005'],
    participants: 1124,
    status: 'Live',
  },
  {
    id: 'CNT-4999',
    title: 'February Open',
    startAt: 'Feb 26, 2026 6:00 PM',
    durationMinutes: 120,
    problemIds: ['PROB-1002', 'PROB-1003', 'PROB-1004'],
    participants: 2032,
    status: 'Completed',
  },
];

const submissionSeed: AdminSubmission[] = [
  {
    id: 'SUB-1101',
    user: 'alex_dev',
    problem: 'Two Sum',
    language: 'Python',
    verdict: 'Accepted',
    submittedAt: '2 mins ago',
    plagiarismScore: 18,
    plagiarismDetected: false,
    cheatingFlags: [],
    contestId: 'CNT-5000',
    codeFingerprint: 'fp_py_hashmap_001',
  },
  {
    id: 'SUB-1100',
    user: 'riya_11',
    problem: 'Longest Substring',
    language: 'Java',
    verdict: 'Wrong Answer',
    submittedAt: '5 mins ago',
    plagiarismScore: 82,
    plagiarismDetected: true,
    cheatingFlags: ['COPY_PATTERN', 'SUSPICIOUS_TIMING'],
    contestId: 'CNT-5000',
    codeFingerprint: 'fp_java_window_117',
  },
  {
    id: 'SUB-1099',
    user: 'coder_vik',
    problem: 'Merge Intervals',
    language: 'C++',
    verdict: 'Time Limit Exceeded',
    submittedAt: '9 mins ago',
    plagiarismScore: 66,
    plagiarismDetected: false,
    cheatingFlags: ['TOOLING_SIGNATURE'],
    contestId: 'CNT-4999',
    codeFingerprint: 'fp_cpp_sort_305',
  },
  {
    id: 'SUB-1098',
    user: 'nina_codes',
    problem: 'LRU Cache',
    language: 'JavaScript',
    verdict: 'Runtime Error',
    submittedAt: '12 mins ago',
    plagiarismScore: 91,
    plagiarismDetected: true,
    cheatingFlags: ['MULTI_ACCOUNT', 'COPY_PATTERN'],
    contestId: 'CNT-4999',
    codeFingerprint: 'fp_js_lru_220',
  },
];

const discussionSeed: AdminDiscussion[] = [
  {
    id: 'DSC-301',
    title: 'Need help with DP state transition',
    author: 'jane_01',
    replies: 14,
    flagged: false,
    category: 'Dynamic Programming',
    spam: false,
    comments: [
      { id: 'CMT-7001', author: 'mentor_raj', content: 'Try defining state as dp[i][sum].', inappropriate: false },
      { id: 'CMT-7002', author: 'spam_bot_5', content: 'DM me for instant accepted answers.', inappropriate: true },
    ],
  },
  {
    id: 'DSC-300',
    title: 'Possible plagiarism in contest?',
    author: 'mentor_k',
    replies: 8,
    flagged: true,
    category: 'Contests',
    spam: false,
    comments: [
      { id: 'CMT-7003', author: 'mod_sara', content: 'Please report submission IDs for review.', inappropriate: false },
      { id: 'CMT-7004', author: 'toxic_user', content: 'Everyone here is cheating losers.', inappropriate: true },
    ],
  },
  {
    id: 'DSC-299',
    title: 'Binary Search boundary confusion',
    author: 'arunv',
    replies: 22,
    flagged: false,
    category: 'Algorithms',
    spam: true,
    comments: [
      { id: 'CMT-7005', author: 'coder_lina', content: 'Use low <= high for closed interval.', inappropriate: false },
    ],
  },
];

const notificationSeed: NotificationTemplate[] = [
  {
    id: 'NTF-201',
    title: 'Contest Reminder',
    message: 'Weekly Challenge 41 starts tonight at 7:00 PM. Register now.',
    audience: 'All students',
    channel: 'In-app + Email',
    status: 'Sent',
    createdAt: '2026-03-11 09:00',
    deliveredCount: 3200,
  },
  {
    id: 'NTF-202',
    title: 'New Problem Set',
    message: 'A new beginner dynamic programming set is now available.',
    audience: 'Beginner track',
    channel: 'In-app',
    status: 'Draft',
    createdAt: '2026-03-11 10:30',
    deliveredCount: 0,
  },
  {
    id: 'NTF-203',
    title: 'Maintenance Alert',
    message: 'Platform maintenance is scheduled for Sunday 02:00 AM UTC.',
    audience: 'All users',
    channel: 'Banner + In-app',
    status: 'Scheduled',
    scheduledFor: '2026-03-13 02:00',
    createdAt: '2026-03-11 11:10',
    deliveredCount: 0,
  },
];

const settingsSeed: AdminSettings = {
  platformName: 'CodeLearn',
  allowRegistration: true,
  emailAlerts: true,
  maintenanceMode: false,
  moderationAutoFilter: true,
  plagiarismAutoCheck: true,
  maxSubmissionsPerDay: 100,
  sessionTimeoutMinutes: 120,
  backupFrequency: 'Daily',
};

const leaderboardSeed: LeaderboardEntry[] = [
  { rank: 1, user: 'coder_raj', score: 1980, solved: 246, penalties: 33 },
  { rank: 2, user: 'nina_codes', score: 1915, solved: 238, penalties: 35 },
  { rank: 3, user: 'alex_dev', score: 1880, solved: 230, penalties: 38 },
  { rank: 4, user: 'riya_11', score: 1810, solved: 219, penalties: 44 },
  { rank: 5, user: 'coder_vik', score: 1765, solved: 210, penalties: 47 },
];

const scoringSystemSeed: ScoringSystem = {
  acceptedPoints: 100,
  wrongAnswerPenalty: 10,
  tlePenalty: 15,
  runtimePenalty: 12,
  plagiarismPenalty: 40,
};

const userActivitySeed: Record<string, AdminUserActivity[]> = {
  'USR-1001': [
    { id: 'ACT-9001', type: 'LOGIN', description: 'User logged into student dashboard', at: '2026-03-11 08:12' },
    { id: 'ACT-9002', type: 'SUBMISSION', description: 'Submitted solution for Two Sum', at: '2026-03-11 08:20' },
  ],
  'USR-1002': [
    { id: 'ACT-9003', type: 'LOGIN', description: 'Administrator sign in', at: '2026-03-11 09:10' },
    { id: 'ACT-9004', type: 'PROFILE_UPDATE', description: 'Updated notification settings', at: '2026-03-11 09:16' },
  ],
  'USR-1003': [
    { id: 'ACT-9005', type: 'STATUS_CHANGE', description: 'Account suspended by admin policy', at: '2026-03-10 14:40' },
  ],
};

export function getUsers(): AdminUser[] {
  return readStore(KEY_USERS, userSeed);
}

function getUserActivityMap(): Record<string, AdminUserActivity[]> {
  return readStore(KEY_USER_ACTIVITY, userActivitySeed);
}

function writeUserActivityMap(map: Record<string, AdminUserActivity[]>): void {
  writeStore(KEY_USER_ACTIVITY, map);
}

function createActivityEntry(type: AdminUserActivityType, description: string): AdminUserActivity {
  const id = `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const at = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return { id, type, description, at };
}

function appendUserActivity(userId: string, type: AdminUserActivityType, description: string): void {
  const activityMap = getUserActivityMap();
  const nextEntry = createActivityEntry(type, description);
  const current = activityMap[userId] || [];
  activityMap[userId] = [nextEntry, ...current];
  writeUserActivityMap(activityMap);
}

export function getUserById(userId: string): AdminUser | null {
  return getUsers().find((item) => item.id === userId) || null;
}

export function getUserActivity(userId: string): AdminUserActivity[] {
  const map = getUserActivityMap();
  return map[userId] || [];
}

export function createUser(payload: { name: string; email: string; role: UserRole }): AdminUser[] {
  const list = getUsers();
  const createdUser: AdminUser = {
    id: nextId('USR', list.map((item) => item.id)),
    name: payload.name,
    email: payload.email,
    role: payload.role,
    status: 'Active',
    joinedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  };
  list.unshift(createdUser);
  writeStore(KEY_USERS, list);
  appendUserActivity(createdUser.id, 'SYSTEM', `User account created for ${createdUser.name}`);
  return list;
}

export function updateUserDetails(userId: string, payload: { name: string; email: string; role: UserRole }): AdminUser[] {
  const updated = getUsers().map((item) => {
    if (item.id !== userId) {
      return item;
    }
    return {
      ...item,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  });
  writeStore(KEY_USERS, updated);
  appendUserActivity(userId, 'PROFILE_UPDATE', `Profile updated to ${payload.name} (${payload.role})`);
  return updated;
}

export function toggleUserStatus(id: string): AdminUser[] {
  const updated = getUsers().map((item) => {
    if (item.id !== id) {
      return item;
    }
    const nextStatus: UserStatus = item.status === 'Active' ? 'Suspended' : 'Active';
    return { ...item, status: nextStatus };
  });
  writeStore(KEY_USERS, updated);
  const changedUser = updated.find((item) => item.id === id);
  if (changedUser) {
    appendUserActivity(id, 'STATUS_CHANGE', `Account marked as ${changedUser.status}`);
  }
  return updated;
}

export function deleteUser(id: string): AdminUser[] {
  const updated = getUsers().filter((item) => item.id !== id);
  writeStore(KEY_USERS, updated);
  const activityMap = getUserActivityMap();
  delete activityMap[id];
  writeUserActivityMap(activityMap);
  return updated;
}

export function getCourses(): AdminCourse[] {
  return readStore(KEY_COURSES, courseSeed);
}

export function getPublishedCourses(): AdminCourse[] {
  return getCourses().filter((item) => item.status === 'Published');
}

export function getCourseById(courseId: string): AdminCourse | null {
  return getCourses().find((item) => item.id === courseId) || null;
}

export function createCourse(payload: { title: string; level: CourseLevel; videos?: string[]; articles?: string[] }): AdminCourse[] {
  const list = getCourses();
  list.unshift({
    id: nextId('CRS', list.map((item) => item.id)),
    title: payload.title,
    level: payload.level,
    enrolled: 0,
    status: 'Draft',
    videos: payload.videos || [],
    articles: payload.articles || [],
  });
  writeStore(KEY_COURSES, list);
  return list;
}

export function updateCourse(
  courseId: string,
  payload: { title: string; level: CourseLevel; status: CourseStatus; videos: string[]; articles: string[] },
): AdminCourse[] {
  const updated = getCourses().map((item) => {
    if (item.id !== courseId) {
      return item;
    }
    return {
      ...item,
      title: payload.title,
      level: payload.level,
      status: payload.status,
      videos: payload.videos,
      articles: payload.articles,
    };
  });
  writeStore(KEY_COURSES, updated);
  return updated;
}

export function toggleCourseStatus(id: string): AdminCourse[] {
  const updated = getCourses().map((item) => {
    if (item.id !== id) {
      return item;
    }
    const nextStatus: CourseStatus = item.status === 'Published' ? 'Draft' : 'Published';
    return { ...item, status: nextStatus };
  });
  writeStore(KEY_COURSES, updated);
  return updated;
}

export function deleteCourse(id: string): AdminCourse[] {
  const updated = getCourses().filter((item) => item.id !== id);
  writeStore(KEY_COURSES, updated);
  return updated;
}

export function getProblems(): AdminProblem[] {
  return readStore(KEY_PROBLEMS, problemSeed);
}

export function getProblemById(problemId: string): AdminProblem | null {
  return getProblems().find((item) => item.id === problemId) || null;
}

export function createProblem(payload: {
  title: string;
  difficulty: ProblemDifficulty;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: ProblemTestCase[];
}): AdminProblem[] {
  const list = getProblems();
  list.unshift({
    id: nextId('PROB', list.map((item) => item.id)),
    title: payload.title,
    difficulty: payload.difficulty,
    author: 'Admin',
    created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    status: 'Draft',
    description: payload.description,
    inputFormat: payload.inputFormat,
    outputFormat: payload.outputFormat,
    constraints: payload.constraints,
    testCases: payload.testCases,
  });
  writeStore(KEY_PROBLEMS, list);
  return list;
}

export function updateProblem(
  problemId: string,
  payload: {
    title: string;
    difficulty: ProblemDifficulty;
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    status: ProblemStatus;
    testCases: ProblemTestCase[];
  },
): AdminProblem[] {
  const updated = getProblems().map((item) => {
    if (item.id !== problemId) {
      return item;
    }
    return {
      ...item,
      title: payload.title,
      difficulty: payload.difficulty,
      description: payload.description,
      inputFormat: payload.inputFormat,
      outputFormat: payload.outputFormat,
      constraints: payload.constraints,
      status: payload.status,
      testCases: payload.testCases,
    };
  });
  writeStore(KEY_PROBLEMS, updated);
  return updated;
}

export function toggleProblemStatus(id: string): AdminProblem[] {
  const updated = getProblems().map((item) => {
    if (item.id !== id) {
      return item;
    }
    const nextStatus: ProblemStatus = item.status === 'Published' ? 'Draft' : 'Published';
    return { ...item, status: nextStatus };
  });
  writeStore(KEY_PROBLEMS, updated);
  return updated;
}

export function deleteProblem(id: string): AdminProblem[] {
  const updated = getProblems().filter((item) => item.id !== id);
  writeStore(KEY_PROBLEMS, updated);
  return updated;
}

export function getContests(): AdminContest[] {
  const raw = readStore<LegacyAdminContest[]>(KEY_CONTESTS, contestSeed);
  const normalized = raw.map((item) => ({
    id: item.id,
    title: item.title,
    startAt: item.startAt,
    durationMinutes: resolveDurationMinutes(item),
    problemIds: Array.isArray(item.problemIds) ? item.problemIds : [],
    participants: item.participants,
    status: item.status,
  }));

  // Keep storage shape up to date to avoid repeated runtime conversions.
  writeStore(KEY_CONTESTS, normalized);
  return normalized;
}

function resolveDurationMinutes(item: LegacyAdminContest): number {
  if (typeof item.durationMinutes === 'number' && Number.isFinite(item.durationMinutes)) {
    return Math.max(15, Math.round(item.durationMinutes));
  }
  if (typeof item.duration === 'string') {
    const match = item.duration.match(/(\d+)/);
    if (match) {
      return Math.max(15, Number(match[1]));
    }
  }
  return 120;
}

export function getContestById(contestId: string): AdminContest | null {
  return getContests().find((item) => item.id === contestId) || null;
}

export function createContest(payload: {
  title: string;
  startAt: string;
  durationMinutes: number;
  problemIds: string[];
}): AdminContest[] {
  const list = getContests();
  list.unshift({
    id: nextId('CNT', list.map((item) => item.id)),
    title: payload.title,
    startAt: payload.startAt,
    durationMinutes: Math.max(15, payload.durationMinutes),
    problemIds: payload.problemIds,
    participants: 0,
    status: 'Upcoming',
  });
  writeStore(KEY_CONTESTS, list);
  return list;
}

export function updateContest(
  contestId: string,
  payload: { title: string; startAt: string; durationMinutes: number; problemIds: string[]; status: ContestStatus },
): AdminContest[] {
  const updated = getContests().map((item) => {
    if (item.id !== contestId) {
      return item;
    }
    return {
      ...item,
      title: payload.title,
      startAt: payload.startAt,
      durationMinutes: Math.max(15, payload.durationMinutes),
      problemIds: payload.problemIds,
      status: payload.status,
    };
  });
  writeStore(KEY_CONTESTS, updated);
  return updated;
}

export function startContest(id: string): AdminContest[] {
  const updated = getContests().map((item) => {
    if (item.id !== id || item.status !== 'Upcoming') {
      return item;
    }
    return { ...item, status: 'Live' as ContestStatus };
  });
  writeStore(KEY_CONTESTS, updated);
  return updated;
}

export function stopContest(id: string): AdminContest[] {
  const updated = getContests().map((item) => {
    if (item.id !== id || item.status !== 'Live') {
      return item;
    }
    return { ...item, status: 'Completed' as ContestStatus };
  });
  writeStore(KEY_CONTESTS, updated);
  return updated;
}

export function deleteContest(id: string): AdminContest[] {
  const updated = getContests().filter((item) => item.id !== id);
  writeStore(KEY_CONTESTS, updated);
  return updated;
}

export function getContestResults(contestId: string): ContestResult[] {
  const contest = getContestById(contestId);
  if (!contest) {
    return [];
  }

  const base = [
    { user: 'alex_dev', solved: 0.94, penalty: 94 },
    { user: 'riya_11', solved: 0.87, penalty: 101 },
    { user: 'coder_vik', solved: 0.81, penalty: 126 },
    { user: 'nina_codes', solved: 0.73, penalty: 141 },
    { user: 'priya_s', solved: 0.69, penalty: 153 },
  ];

  const totalProblems = Math.max(1, contest.problemIds.length);
  return base
    .map((item) => ({
      user: item.user,
      solved: Math.max(0, Math.min(totalProblems, Math.round(item.solved * totalProblems))),
      penalty: item.penalty + Math.floor(contest.durationMinutes / 3),
    }))
    .sort((a, b) => {
      if (a.solved !== b.solved) {
        return b.solved - a.solved;
      }
      return a.penalty - b.penalty;
    })
    .map((item, index) => ({
      rank: index + 1,
      user: item.user,
      solved: item.solved,
      penalty: item.penalty,
    }));
}

export function formatContestDuration(durationMinutes: number): string {
  return `${durationMinutes} min`;
}

export function getSubmissions(): AdminSubmission[] {
  const raw = readStore<LegacyAdminSubmission[]>(KEY_SUBMISSIONS, submissionSeed);
  const normalized = raw.map((item) => {
    const computedScore = derivePlagiarismScore(item);
    const flags = normalizeCheatingFlags(item.cheatingFlags, computedScore);
    return {
      id: item.id,
      user: item.user,
      problem: item.problem,
      language: item.language,
      verdict: item.verdict,
      submittedAt: item.submittedAt,
      plagiarismScore: computedScore,
      plagiarismDetected: typeof item.plagiarismDetected === 'boolean' ? item.plagiarismDetected : computedScore >= 80,
      cheatingFlags: flags,
      contestId: item.contestId,
      codeFingerprint: item.codeFingerprint || `${item.language.toLowerCase()}_${item.problem.toLowerCase().replace(/\s+/g, '_')}`,
    };
  });

  writeStore(KEY_SUBMISSIONS, normalized);
  return normalized;
}

function derivePlagiarismScore(item: LegacyAdminSubmission): number {
  if (typeof item.plagiarismScore === 'number' && Number.isFinite(item.plagiarismScore)) {
    return Math.max(0, Math.min(100, Math.round(item.plagiarismScore)));
  }

  const baseByVerdict: Record<SubmissionVerdict, number> = {
    Accepted: 22,
    'Wrong Answer': 45,
    'Time Limit Exceeded': 60,
    'Runtime Error': 54,
  };
  const languageBump = item.language.toLowerCase() === 'python' ? 6 : item.language.toLowerCase() === 'javascript' ? 10 : 0;
  return Math.max(0, Math.min(100, baseByVerdict[item.verdict] + languageBump));
}

function normalizeCheatingFlags(
  existing: SubmissionCheatingFlag[] | undefined,
  plagiarismScore: number,
): SubmissionCheatingFlag[] {
  if (Array.isArray(existing) && existing.length > 0) {
    return existing;
  }

  if (plagiarismScore >= 90) {
    return ['COPY_PATTERN', 'MULTI_ACCOUNT'];
  }
  if (plagiarismScore >= 75) {
    return ['COPY_PATTERN'];
  }
  if (plagiarismScore >= 60) {
    return ['SUSPICIOUS_TIMING'];
  }
  return [];
}

export function getSubmissionMonitoringSummary(): {
  total: number;
  plagiarismDetected: number;
  cheatingFlagged: number;
  highRisk: number;
} {
  const submissions = getSubmissions();
  return {
    total: submissions.length,
    plagiarismDetected: submissions.filter((row) => row.plagiarismDetected).length,
    cheatingFlagged: submissions.filter((row) => row.cheatingFlags.length > 0).length,
    highRisk: submissions.filter((row) => row.plagiarismScore >= 80 || row.cheatingFlags.length >= 2).length,
  };
}

export function getDiscussions(): AdminDiscussion[] {
  const raw = readStore<LegacyAdminDiscussion[]>(KEY_DISCUSSIONS, discussionSeed);
  const normalized = raw.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    replies: row.replies,
    flagged: row.flagged,
    category: row.category,
    spam: Boolean(row.spam),
    comments: Array.isArray(row.comments) ? row.comments : [],
  }));
  writeStore(KEY_DISCUSSIONS, normalized);
  return normalized;
}

export function toggleDiscussionFlag(id: string): AdminDiscussion[] {
  const updated = getDiscussions().map((item) => {
    if (item.id !== id) {
      return item;
    }
    return { ...item, flagged: !item.flagged };
  });
  writeStore(KEY_DISCUSSIONS, updated);
  return updated;
}

export function deleteDiscussion(id: string): AdminDiscussion[] {
  const updated = getDiscussions().filter((item) => item.id !== id);
  writeStore(KEY_DISCUSSIONS, updated);
  return updated;
}

export function removeInappropriateComment(discussionId: string, commentId: string): AdminDiscussion[] {
  const updated = getDiscussions().map((item) => {
    if (item.id !== discussionId) {
      return item;
    }
    const nextComments = item.comments.filter((comment) => comment.id !== commentId);
    return {
      ...item,
      comments: nextComments,
      replies: nextComments.length,
    };
  });
  writeStore(KEY_DISCUSSIONS, updated);
  return updated;
}

export function deleteSpamDiscussion(id: string): AdminDiscussion[] {
  const current = getDiscussions();
  const target = current.find((item) => item.id === id);
  if (!target || !target.spam) {
    return current;
  }
  const updated = current.filter((item) => item.id !== id);
  writeStore(KEY_DISCUSSIONS, updated);
  return updated;
}

export function getBannedDiscussionUsers(): string[] {
  return readStore<string[]>(KEY_BANNED_DISCUSSION_USERS, []);
}

export function banDiscussionUser(userHandle: string): string[] {
  const current = getBannedDiscussionUsers();
  if (current.includes(userHandle)) {
    return current;
  }
  const updated = [...current, userHandle];
  writeStore(KEY_BANNED_DISCUSSION_USERS, updated);
  return updated;
}

export function getDiscussionModerationSummary(): {
  totalDiscussions: number;
  spamPosts: number;
  inappropriateComments: number;
  bannedUsers: number;
} {
  const discussions = getDiscussions();
  const inappropriateComments = discussions.reduce(
    (count, row) => count + row.comments.filter((comment) => comment.inappropriate).length,
    0,
  );
  return {
    totalDiscussions: discussions.length,
    spamPosts: discussions.filter((row) => row.spam).length,
    inappropriateComments,
    bannedUsers: getBannedDiscussionUsers().length,
  };
}

export function getNotifications(): NotificationTemplate[] {
  const raw = readStore<LegacyNotificationTemplate[]>(KEY_NOTIFICATIONS, notificationSeed);
  const normalized = raw.map((item) => normalizeNotification(item));
  writeStore(KEY_NOTIFICATIONS, normalized);
  return normalized;
}

export function createNotification(payload: {
  title: string;
  message: string;
  audience: string;
  channel: string;
  scheduledFor?: string;
}): NotificationTemplate[] {
  const list = getNotifications();
  const hasSchedule = Boolean(payload.scheduledFor && payload.scheduledFor.trim());
  list.unshift({
    id: nextId('NTF', list.map((item) => item.id)),
    title: payload.title,
    message: payload.message,
    audience: payload.audience,
    channel: payload.channel,
    status: hasSchedule ? 'Scheduled' : 'Draft',
    scheduledFor: hasSchedule ? payload.scheduledFor : undefined,
    createdAt: formatNow(),
    deliveredCount: 0,
  });
  writeStore(KEY_NOTIFICATIONS, list);
  return list;
}

export function sendAnnouncementNow(id: string): NotificationTemplate[] {
  const updated = getNotifications().map((item) => {
    if (item.id !== id) {
      return item;
    }
    return {
      ...item,
      status: 'Sent' as NotificationStatus,
      scheduledFor: undefined,
      deliveredCount: estimateAudienceSize(item.audience),
    };
  });
  writeStore(KEY_NOTIFICATIONS, updated);
  return updated;
}

export function scheduleAnnouncement(id: string, scheduledFor: string): NotificationTemplate[] {
  const updated = getNotifications().map((item) => {
    if (item.id !== id) {
      return item;
    }
    return {
      ...item,
      status: 'Scheduled' as NotificationStatus,
      scheduledFor,
      deliveredCount: 0,
    };
  });
  writeStore(KEY_NOTIFICATIONS, updated);
  return updated;
}

export function getAnnouncementSummary(): {
  total: number;
  sent: number;
  scheduled: number;
  draft: number;
  notifiedUsers: number;
} {
  const notifications = getNotifications();
  return {
    total: notifications.length,
    sent: notifications.filter((item) => item.status === 'Sent').length,
    scheduled: notifications.filter((item) => item.status === 'Scheduled').length,
    draft: notifications.filter((item) => item.status === 'Draft').length,
    notifiedUsers: notifications.reduce((sum, item) => sum + item.deliveredCount, 0),
  };
}

export function deleteNotification(id: string): NotificationTemplate[] {
  const updated = getNotifications().filter((item) => item.id !== id);
  writeStore(KEY_NOTIFICATIONS, updated);
  return updated;
}

function normalizeNotification(item: LegacyNotificationTemplate): NotificationTemplate {
  const status: NotificationStatus =
    item.status === 'Active' ? 'Sent' : item.status === 'Draft' || item.status === 'Scheduled' || item.status === 'Sent'
      ? item.status
      : 'Draft';
  return {
    id: item.id,
    title: item.title,
    message: item.message || 'Announcement update',
    audience: item.audience,
    channel: item.channel,
    status,
    scheduledFor: item.scheduledFor,
    createdAt: item.createdAt || formatNow(),
    deliveredCount: typeof item.deliveredCount === 'number' ? item.deliveredCount : status === 'Sent' ? estimateAudienceSize(item.audience) : 0,
  };
}

function estimateAudienceSize(audience: string): number {
  const lower = audience.toLowerCase();
  if (lower.includes('all')) {
    return 4000;
  }
  if (lower.includes('beginner')) {
    return 1200;
  }
  if (lower.includes('admin')) {
    return 80;
  }
  return 600;
}

function formatNow(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function getSettings(): AdminSettings {
  const raw = readStore<LegacyAdminSettings>(KEY_SETTINGS, settingsSeed);
  const normalized: AdminSettings = {
    platformName: raw.platformName || settingsSeed.platformName,
    allowRegistration: typeof raw.allowRegistration === 'boolean' ? raw.allowRegistration : settingsSeed.allowRegistration,
    emailAlerts: typeof raw.emailAlerts === 'boolean' ? raw.emailAlerts : settingsSeed.emailAlerts,
    maintenanceMode: typeof raw.maintenanceMode === 'boolean' ? raw.maintenanceMode : settingsSeed.maintenanceMode,
    moderationAutoFilter:
      typeof raw.moderationAutoFilter === 'boolean' ? raw.moderationAutoFilter : settingsSeed.moderationAutoFilter,
    plagiarismAutoCheck:
      typeof raw.plagiarismAutoCheck === 'boolean' ? raw.plagiarismAutoCheck : settingsSeed.plagiarismAutoCheck,
    maxSubmissionsPerDay: Math.max(1, Math.round(raw.maxSubmissionsPerDay || settingsSeed.maxSubmissionsPerDay)),
    sessionTimeoutMinutes: Math.max(5, Math.round(raw.sessionTimeoutMinutes || settingsSeed.sessionTimeoutMinutes)),
    backupFrequency:
      raw.backupFrequency === 'Daily' || raw.backupFrequency === 'Weekly' || raw.backupFrequency === 'Monthly'
        ? raw.backupFrequency
        : settingsSeed.backupFrequency,
  };
  writeStore(KEY_SETTINGS, normalized);
  return normalized;
}

export function saveSettings(payload: AdminSettings): AdminSettings {
  const normalized: AdminSettings = {
    platformName: payload.platformName.trim() || settingsSeed.platformName,
    allowRegistration: payload.allowRegistration,
    emailAlerts: payload.emailAlerts,
    maintenanceMode: payload.maintenanceMode,
    moderationAutoFilter: payload.moderationAutoFilter,
    plagiarismAutoCheck: payload.plagiarismAutoCheck,
    maxSubmissionsPerDay: Math.max(1, Math.round(payload.maxSubmissionsPerDay)),
    sessionTimeoutMinutes: Math.max(5, Math.round(payload.sessionTimeoutMinutes)),
    backupFrequency: payload.backupFrequency,
  };
  writeStore(KEY_SETTINGS, normalized);
  return normalized;
}

export function getScoringSystem(): ScoringSystem {
  const raw = readStore<ScoringSystem>(KEY_SCORING_SYSTEM, scoringSystemSeed);
  const normalized: ScoringSystem = {
    acceptedPoints: Math.max(1, Math.round(raw.acceptedPoints || scoringSystemSeed.acceptedPoints)),
    wrongAnswerPenalty: Math.max(0, Math.round(raw.wrongAnswerPenalty || 0)),
    tlePenalty: Math.max(0, Math.round(raw.tlePenalty || 0)),
    runtimePenalty: Math.max(0, Math.round(raw.runtimePenalty || 0)),
    plagiarismPenalty: Math.max(0, Math.round(raw.plagiarismPenalty || 0)),
  };
  writeStore(KEY_SCORING_SYSTEM, normalized);
  return normalized;
}

export function updateScoringSystem(payload: ScoringSystem): ScoringSystem {
  const normalized: ScoringSystem = {
    acceptedPoints: Math.max(1, Math.round(payload.acceptedPoints)),
    wrongAnswerPenalty: Math.max(0, Math.round(payload.wrongAnswerPenalty)),
    tlePenalty: Math.max(0, Math.round(payload.tlePenalty)),
    runtimePenalty: Math.max(0, Math.round(payload.runtimePenalty)),
    plagiarismPenalty: Math.max(0, Math.round(payload.plagiarismPenalty)),
  };
  writeStore(KEY_SCORING_SYSTEM, normalized);
  return normalized;
}

export function getLeaderboardEntries(): LeaderboardEntry[] {
  const raw = readStore<LegacyLeaderboardEntry[]>(KEY_LEADERBOARD, leaderboardSeed);
  const normalized = normalizeLeaderboard(raw);
  writeStore(KEY_LEADERBOARD, normalized);
  return normalized;
}

export function resetLeaderboard(): LeaderboardEntry[] {
  const existing = getLeaderboardEntries();
  const reset = existing
    .map((row) => ({ ...row, score: 0, solved: 0, penalties: 0 }))
    .sort((a, b) => a.user.localeCompare(b.user))
    .map((row, index) => ({ ...row, rank: index + 1 }));
  writeStore(KEY_LEADERBOARD, reset);
  return reset;
}

export function updateLeaderboardRankings(): LeaderboardEntry[] {
  const scoring = getScoringSystem();
  const submissions = getSubmissions();
  const byUser = new Map<string, { score: number; solved: number; penalties: number }>();

  for (const row of submissions) {
    const current = byUser.get(row.user) || { score: 0, solved: 0, penalties: 0 };
    if (row.verdict === 'Accepted') {
      current.score += scoring.acceptedPoints;
      current.solved += 1;
    } else if (row.verdict === 'Wrong Answer') {
      current.score -= scoring.wrongAnswerPenalty;
      current.penalties += scoring.wrongAnswerPenalty;
    } else if (row.verdict === 'Time Limit Exceeded') {
      current.score -= scoring.tlePenalty;
      current.penalties += scoring.tlePenalty;
    } else {
      current.score -= scoring.runtimePenalty;
      current.penalties += scoring.runtimePenalty;
    }

    if (row.plagiarismDetected) {
      current.score -= scoring.plagiarismPenalty;
      current.penalties += scoring.plagiarismPenalty;
    }
    if (row.cheatingFlags.length > 0) {
      current.penalties += row.cheatingFlags.length * 5;
      current.score -= row.cheatingFlags.length * 5;
    }
    byUser.set(row.user, current);
  }

  const next = Array.from(byUser.entries())
    .map(([user, stats]) => ({
      rank: 0,
      user,
      score: Math.max(0, stats.score),
      solved: stats.solved,
      penalties: stats.penalties,
    }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      if (a.solved !== b.solved) {
        return b.solved - a.solved;
      }
      return a.penalties - b.penalties;
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

  writeStore(KEY_LEADERBOARD, next);
  return next;
}

export function getLeaderboardControlSummary(): {
  participants: number;
  topScore: number;
  avgScore: number;
  scoringVersion: string;
} {
  const entries = getLeaderboardEntries();
  const total = entries.reduce((sum, row) => sum + row.score, 0);
  return {
    participants: entries.length,
    topScore: entries[0]?.score || 0,
    avgScore: entries.length > 0 ? Math.round(total / entries.length) : 0,
    scoringVersion: 'v1.0',
  };
}

function normalizeLeaderboard(raw: LegacyLeaderboardEntry[]): LeaderboardEntry[] {
  return raw
    .map((row) => ({
      rank: row.rank || 0,
      user: row.user,
      score: Math.max(0, Math.round(row.score || 0)),
      solved: Math.max(0, Math.round(row.solved || 0)),
      penalties: Math.max(0, Math.round(row.penalties || 0)),
    }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      if (a.solved !== b.solved) {
        return b.solved - a.solved;
      }
      return a.penalties - b.penalties;
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getAnalyticsSnapshot(): {
  totalUsers: number;
  totalProblems: number;
  activeContests: number;
  weeklyGrowth: string;
  dailyActiveUsers: number;
  solvedCount: number;
  contestParticipation: number;
  acceptanceRate: string;
} {
  const users = getUsers();
  const problems = getProblems();
  const contests = getContests();
  const submissions = getSubmissions();
  const accepted = submissions.filter((row) => row.verdict === 'Accepted').length;
  const acceptanceRate = submissions.length > 0 ? `${((accepted / submissions.length) * 100).toFixed(1)}%` : '0.0%';

  return {
    totalUsers: users.length,
    totalProblems: problems.length,
    activeContests: contests.filter((row) => row.status === 'Live').length,
    weeklyGrowth: '+8.4%',
    dailyActiveUsers: Math.max(1000, Math.round(users.length * 0.42) * 100),
    solvedCount: submissions.length * 12,
    contestParticipation: contests.reduce((sum, row) => sum + row.participants, 0),
    acceptanceRate,
  };
}
