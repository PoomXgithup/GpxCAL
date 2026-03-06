import { Trash2, BookOpen } from 'lucide-react';
import { Subject } from '../lib/supabase';
import { getLetterGrade } from '../lib/gpaCalculations';

interface SubjectListProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
}

export default function SubjectList({ subjects, onDelete }: SubjectListProps) {
  if (subjects.length === 0) {
    return (
      <div className="glassmorphism p-8 rounded-2xl text-center">
        <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-400 text-lg">No subjects added yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first subject to start calculating your GPA</p>
      </div>
    );
  }

  return (
    <div className="glassmorphism p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Current Subjects</h2>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{subject.title}</h3>
              <div className="flex gap-4 mt-1">
                <span className="text-gray-400 text-sm">
                  {subject.credits} {subject.credits === 1 ? 'Credit' : 'Credits'}
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-cyan-400 text-sm font-medium">
                  {getLetterGrade(subject.grade)} ({subject.grade.toFixed(2)})
                </span>
              </div>
            </div>

            <button
              onClick={() => onDelete(subject.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Delete subject"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
