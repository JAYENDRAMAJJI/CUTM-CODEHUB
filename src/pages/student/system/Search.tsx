import { useEffect, useMemo, useState } from 'react';
import StudentPageFrame from '../components/StudentPageFrame';
import {
  AdminContest,
  AdminCourse,
  AdminProblem,
  getContests,
  getProblems,
  getPublishedCourses,
} from '../../../data/adminApi';

type SearchType = 'All' | 'Courses' | 'Problems' | 'Contests' | 'Tutorials';

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  type: Exclude<SearchType, 'All'>;
};

const tutorialItems: SearchItem[] = [
  { id: 'TUT-1', title: 'Mastering Binary Search', subtitle: 'Tutorial - Beginner', type: 'Tutorials' },
  { id: 'TUT-2', title: 'Graph Traversal Patterns', subtitle: 'Tutorial - Intermediate', type: 'Tutorials' },
  { id: 'TUT-3', title: 'Dynamic Programming States', subtitle: 'Tutorial - Advanced', type: 'Tutorials' },
  { id: 'TUT-4', title: 'Sliding Window Essentials', subtitle: 'Tutorial - Beginner', type: 'Tutorials' },
];

export default function StudentSearch() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>('All');

  useEffect(() => {
    const syncData = () => {
      setCourses(getPublishedCourses());
      setProblems(getProblems().filter((p) => p.status === 'Published'));
      setContests(getContests());
    };
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const resultsByType = useMemo(() => {
    const allItems: SearchItem[] = [
      ...courses.map((course) => ({
        id: course.id,
        title: course.title,
        subtitle: `${course.level} - ${course.id}`,
        type: 'Courses' as const,
      })),
      ...problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        subtitle: `${problem.difficulty} - ${problem.id}`,
        type: 'Problems' as const,
      })),
      ...contests.map((contest) => ({
        id: contest.id,
        title: contest.title,
        subtitle: `${contest.status} - ${contest.id}`,
        type: 'Contests' as const,
      })),
      ...tutorialItems,
    ];

    const lowered = query.trim().toLowerCase();
    const searched = allItems.filter((item) => {
      if (!lowered) return true;
      return (
        item.title.toLowerCase().includes(lowered)
        || item.subtitle.toLowerCase().includes(lowered)
        || item.id.toLowerCase().includes(lowered)
      );
    });

    const scoped = type === 'All' ? searched : searched.filter((item) => item.type === type);

    return {
      Courses: scoped.filter((item) => item.type === 'Courses'),
      Problems: scoped.filter((item) => item.type === 'Problems'),
      Contests: scoped.filter((item) => item.type === 'Contests'),
      Tutorials: scoped.filter((item) => item.type === 'Tutorials'),
    };
  }, [courses, problems, contests, query, type]);

  const resultCount =
    resultsByType.Courses.length
    + resultsByType.Problems.length
    + resultsByType.Contests.length
    + resultsByType.Tutorials.length;

  return (
    <StudentPageFrame title="Search" subtitle="Find courses, problems, tutorials, and contests quickly.">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in student modules"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SearchType)}
            title="Filter results by type"
            aria-label="Filter results by type"
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
          >
            <option>All</option>
            <option>Courses</option>
            <option>Problems</option>
            <option>Contests</option>
            <option>Tutorials</option>
          </select>
        </div>

        <p className="text-xs text-slate-500">{resultCount} result{resultCount === 1 ? '' : 's'} found</p>

        {(['Courses', 'Problems', 'Contests', 'Tutorials'] as const).map((section) => {
          const items = resultsByType[section];
          if (items.length === 0) return null;

          return (
            <div key={section} className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">{section}</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {items.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="border border-slate-200 rounded-lg px-3 py-2">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {resultCount === 0 && <p className="text-sm text-slate-500">No matching items</p>}
      </div>
    </StudentPageFrame>
  );
}
