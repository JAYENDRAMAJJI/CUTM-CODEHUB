import { ReactNode } from 'react';

type StudentPageFrameProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function StudentPageFrame({ title, subtitle, children }: StudentPageFrameProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
        <div className="h-1 w-16 rounded-full bg-indigo-500 mb-3" />
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-600 mt-1 text-sm sm:text-base">{subtitle}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">{children}</div>
    </div>
  );
}
