export type UserRole = 'Student' | 'Admin';
export type UserStatus = 'Active' | 'Suspended';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedOn: string;
};

export type AdminUserActivityType = 'LOGIN' | 'SUBMISSION' | 'PROFILE_UPDATE' | 'STATUS_CHANGE' | 'SYSTEM';

export type AdminUserActivity = {
  id: string;
  type: AdminUserActivityType;
  description: string;
  at: string;
};

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Published' | 'Draft';

export type AdminCourse = {
  id: string;
  title: string;
  level: CourseLevel;
  enrolled: number;
  status: CourseStatus;
  videos: string[];
  articles: string[];
};

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Published' | 'Draft';

export type ProblemTestCase = {
  input: string;
  output: string;
};

export type AdminProblem = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  author: string;
  created: string;
  status: ProblemStatus;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  testCases: ProblemTestCase[];
};

export type ContestStatus = 'Upcoming' | 'Live' | 'Completed';

export type AdminContest = {
  id: string;
  title: string;
  startAt: string;
  durationMinutes: number;
  problemIds: string[];
  participants: number;
  status: ContestStatus;
};

export type ContestResult = {
  rank: number;
  user: string;
  solved: number;
  penalty: number;
};

export type SubmissionVerdict = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';

export type SubmissionCheatingFlag = 'MULTI_ACCOUNT' | 'SUSPICIOUS_TIMING' | 'COPY_PATTERN' | 'TOOLING_SIGNATURE';

export type AdminSubmission = {
  id: string;
  user: string;
  problem: string;
  language: string;
  verdict: SubmissionVerdict;
  submittedAt: string;
  plagiarismScore: number;
  plagiarismDetected: boolean;
  cheatingFlags: SubmissionCheatingFlag[];
  contestId?: string;
  codeFingerprint: string;
};

export type AdminDiscussion = {
  id: string;
  title: string;
  author: string;
  replies: number;
  flagged: boolean;
  category: string;
  spam: boolean;
  comments: AdminDiscussionComment[];
};

export type AdminDiscussionComment = {
  id: string;
  author: string;
  content: string;
  inappropriate: boolean;
};

export type NotificationStatus = 'Draft' | 'Scheduled' | 'Sent';

export type NotificationTemplate = {
  id: string;
  title: string;
  message: string;
  audience: string;
  channel: string;
  status: NotificationStatus;
  scheduledFor?: string;
  createdAt: string;
  deliveredCount: number;
};

export type AdminSettings = {
  platformName: string;
  allowRegistration: boolean;
  emailAlerts: boolean;
  maintenanceMode: boolean;
  moderationAutoFilter: boolean;
  plagiarismAutoCheck: boolean;
  maxSubmissionsPerDay: number;
  sessionTimeoutMinutes: number;
  backupFrequency: 'Daily' | 'Weekly' | 'Monthly';
};

export type LeaderboardEntry = {
  rank: number;
  user: string;
  score: number;
  solved: number;
  penalties: number;
};

export type ScoringSystem = {
  acceptedPoints: number;
  wrongAnswerPenalty: number;
  tlePenalty: number;
  runtimePenalty: number;
  plagiarismPenalty: number;
};
