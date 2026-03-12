import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { ProblemDifficulty, ProblemTestCase, createProblem } from '../../data/adminApi';

export default function AdminProblemCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>('Easy');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [testCases, setTestCases] = useState<ProblemTestCase[]>([{ input: '', output: '' }]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    createProblem({
      title: title.trim(),
      difficulty,
      description: description.trim(),
      inputFormat: inputFormat.trim(),
      outputFormat: outputFormat.trim(),
      constraints: constraints.trim(),
      testCases: testCases.filter((item) => item.input.trim() && item.output.trim()),
    });

    navigate('/admin/problems', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/problems" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to problem list
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Create Problem</h1>
        <p className="text-slate-500 mt-1">Add complete problem metadata and test coverage.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="problem-title" className="block text-sm font-medium text-slate-700 mb-1">Problem Title</label>
            <input
              id="problem-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="problem-difficulty" className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <select
              id="problem-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as ProblemDifficulty)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="problem-description" className="block text-sm font-medium text-slate-700 mb-1">Problem Description</label>
          <textarea
            id="problem-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-28 px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input-format" className="block text-sm font-medium text-slate-700 mb-1">Input Format</label>
            <textarea
              id="input-format"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label htmlFor="output-format" className="block text-sm font-medium text-slate-700 mb-1">Output Format</label>
            <textarea
              id="output-format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="constraints" className="block text-sm font-medium text-slate-700 mb-1">Constraints</label>
          <textarea
            id="constraints"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Test Cases</h2>
            <button
              type="button"
              onClick={() => setTestCases((prev) => [...prev, { input: '', output: '' }])}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Plus className="w-3 h-3" />
              Add Test Case
            </button>
          </div>

          {testCases.map((testCase, index) => (
            <div key={`test-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              <input
                value={testCase.input}
                onChange={(e) => {
                  const next = [...testCases];
                  next[index] = { ...next[index], input: e.target.value };
                  setTestCases(next);
                }}
                placeholder="Input"
                title="Test case input"
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <input
                value={testCase.output}
                onChange={(e) => {
                  const next = [...testCases];
                  next[index] = { ...next[index], output: e.target.value };
                  setTestCases(next);
                }}
                placeholder="Expected output"
                title="Expected output"
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => setTestCases((prev) => prev.filter((_, i) => i !== index))}
                className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700"
                title="Remove test case"
                aria-label="Remove test case"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Save className="w-4 h-4" />
          Create Problem
        </button>
      </form>
    </div>
  );
}
