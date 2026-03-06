import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { getLetterGrade } from '../lib/gpaCalculations';

interface StatsCardProps {
  currentGPA: number;
  totalSubjects: number;
  totalCredits: number;
}

export default function StatsCard({ currentGPA, totalSubjects, totalCredits }: StatsCardProps) {
  return (
    <div className="glassmorphism p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
          <GraduationCap size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Current Semester</h2>
          <p className="text-gray-400 text-sm">Your academic performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Award size={18} className="text-cyan-400" />
            <p className="text-gray-400 text-sm font-medium">Semester GPA</p>
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {currentGPA > 0 ? currentGPA.toFixed(2) : '0.00'}
          </p>
          <p className="text-cyan-400 text-sm font-semibold">
            {currentGPA > 0 ? getLetterGrade(currentGPA) : 'N/A'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-blue-400" />
            <p className="text-gray-400 text-sm font-medium">Subjects</p>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{totalSubjects}</p>
          <p className="text-blue-400 text-sm font-semibold">
            {totalSubjects === 1 ? 'Course' : 'Courses'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={18} className="text-purple-400" />
            <p className="text-gray-400 text-sm font-medium">Credits</p>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{totalCredits}</p>
          <p className="text-purple-400 text-sm font-semibold">Hours</p>
        </div>
      </div>
    </div>
  );
}
