import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Subject } from '../lib/supabase';
import { getLetterGrade } from '../lib/gpaCalculations';
import { BarChart3 } from 'lucide-react';

interface GPAChartsProps {
  subjects: Subject[];
  currentGPA: number;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function GPACharts({ subjects, currentGPA }: GPAChartsProps) {
  if (subjects.length === 0) {
    return null;
  }

  const gradeDistribution = subjects.reduce((acc, subject) => {
    const letter = getLetterGrade(subject.grade);
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(gradeDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = subjects.map((subject) => ({
    name: subject.title.length > 15 ? subject.title.substring(0, 15) + '...' : subject.title,
    gpa: subject.grade,
    credits: subject.credits,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-cyan-400">GPA: {payload[0].value.toFixed(2)}</p>
          {payload[0].payload.credits && (
            <p className="text-gray-400 text-sm">Credits: {payload[0].payload.credits}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glassmorphism p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 size={24} />
        Grade Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                domain={[0, 4]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gpa" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Current Semester GPA</p>
          <p className="text-3xl font-bold text-white mt-1">{currentGPA.toFixed(2)}</p>
          <p className="text-cyan-400 text-sm mt-1">{getLetterGrade(currentGPA)} Grade</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Subjects</p>
          <p className="text-3xl font-bold text-white mt-1">{subjects.length}</p>
          <p className="text-purple-400 text-sm mt-1">Courses</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Credits</p>
          <p className="text-3xl font-bold text-white mt-1">
            {subjects.reduce((sum, s) => sum + s.credits, 0)}
          </p>
          <p className="text-green-400 text-sm mt-1">Credit Hours</p>
        </div>
      </div>
    </div>
  );
}
