import { useState, useEffect } from 'react';
import { Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { UserSettings } from '../lib/supabase';
import { calculateRequiredGPA } from '../lib/gpaCalculations';

interface GPAXCalculatorProps {
  settings: UserSettings | null;
  currentSemesterGPA: number;
  currentSemesterCredits: number;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function GPAXCalculator({
  settings,
  currentSemesterGPA,
  currentSemesterCredits,
  onUpdateSettings,
}: GPAXCalculatorProps) {
  const [cumulativeGPA, setCumulativeGPA] = useState('0');
  const [totalCredits, setTotalCredits] = useState('0');
  const [targetGPA, setTargetGPA] = useState('4.00');

  useEffect(() => {
    if (settings) {
      setCumulativeGPA(settings.current_cumulative_gpa.toString());
      setTotalCredits(settings.total_credits_earned.toString());
      setTargetGPA(settings.target_gpax.toString());
    }
  }, [settings]);

  const handleUpdate = () => {
    onUpdateSettings({
      current_cumulative_gpa: parseFloat(cumulativeGPA),
      total_credits_earned: parseFloat(totalCredits),
      target_gpax: parseFloat(targetGPA),
    });
  };

  const requiredGPA = calculateRequiredGPA(
    parseFloat(cumulativeGPA),
    parseFloat(totalCredits),
    parseFloat(targetGPA),
    currentSemesterCredits
  );

  const isMissionImpossible = requiredGPA > 4.0;
  const newCumulativeGPA =
    (parseFloat(cumulativeGPA) * parseFloat(totalCredits) +
      currentSemesterGPA * currentSemesterCredits) /
    (parseFloat(totalCredits) + currentSemesterCredits);

  return (
    <div className="space-y-6">
      <div className="glassmorphism p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={24} />
          Cumulative GPAX
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Cumulative GPA
            </label>
            <input
              type="number"
              value={cumulativeGPA}
              onChange={(e) => setCumulativeGPA(e.target.value)}
              onBlur={handleUpdate}
              min="0"
              max="4"
              step="0.01"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Credits Earned
            </label>
            <input
              type="number"
              value={totalCredits}
              onChange={(e) => setTotalCredits(e.target.value)}
              onBlur={handleUpdate}
              min="0"
              step="0.5"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {parseFloat(totalCredits) > 0 && currentSemesterCredits > 0 && (
          <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-gray-300 text-sm">Projected New Cumulative GPA:</p>
            <p className="text-cyan-400 text-3xl font-bold mt-1">
              {newCumulativeGPA.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="glassmorphism p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Target size={24} />
          Goal Setting
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target GPAX
          </label>
          <input
            type="number"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e.target.value)}
            onBlur={handleUpdate}
            min="0"
            max="4"
            step="0.01"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {currentSemesterCredits > 0 && parseFloat(targetGPA) > 0 && (
          <div
            className={`p-6 rounded-xl ${
              isMissionImpossible
                ? 'bg-red-500/10 border border-red-500/30'
                : 'bg-blue-500/10 border border-blue-500/30'
            }`}
          >
            {isMissionImpossible ? (
              <div className="flex items-start gap-4">
                <AlertTriangle size={32} className="text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-red-400 text-xl font-bold mb-2">
                    Mission Impossible!
                  </h3>
                  <p className="text-gray-300 mb-2">
                    To reach your target GPAX of {parseFloat(targetGPA).toFixed(2)}, you would need a GPA of:
                  </p>
                  <p className="text-red-400 text-4xl font-bold mb-2">
                    {requiredGPA.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    This is above the maximum possible GPA of 4.00. Consider adjusting your target or adding more credits to future semesters.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-blue-400 text-lg font-semibold mb-2">
                  Required GPA This Semester
                </h3>
                <p className="text-gray-300 mb-2">
                  To reach your target GPAX of {parseFloat(targetGPA).toFixed(2)}:
                </p>
                <p className="text-blue-400 text-4xl font-bold mb-2">
                  {requiredGPA.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  {requiredGPA >= 3.5
                    ? 'Aim for mostly A grades!'
                    : requiredGPA >= 3.0
                    ? 'Focus on B+ and A grades.'
                    : requiredGPA >= 2.5
                    ? 'Maintain B and C+ grades.'
                    : 'Keep working steadily!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
