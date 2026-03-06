import { useState } from 'react';
import { Plus } from 'lucide-react';
import { gradeOptions } from '../lib/gpaCalculations';

interface SubjectFormProps {
  onAdd: (title: string, credits: number, grade: number) => void;
}

export default function SubjectForm({ onAdd }: SubjectFormProps) {
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState('3');
  const [grade, setGrade] = useState('4.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), parseFloat(credits), parseFloat(grade));
      setTitle('');
      setCredits('3');
      setGrade('4.0');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glassmorphism p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add Subject</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subject Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Calculus I"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Credits
          </label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            min="0.5"
            max="10"
            step="0.5"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {gradeOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Subject
        </button>
      </div>
    </form>
  );
}
