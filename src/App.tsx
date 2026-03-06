import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { supabase, Subject, UserSettings } from './lib/supabase';
import { calculateGPA } from './lib/gpaCalculations';
import SubjectForm from './components/SubjectForm';
import SubjectList from './components/SubjectList';
import StatsCard from './components/StatsCard';
import GPAXCalculator from './components/GPAXCalculator';
import GPACharts from './components/GPACharts';

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subjectsResponse, settingsResponse] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: false }),
        supabase.from('user_settings').select('*').limit(1).maybeSingle(),
      ]);

      if (subjectsResponse.data) {
        setSubjects(subjectsResponse.data);
      }

      if (settingsResponse.data) {
        setSettings(settingsResponse.data);
      } else {
        const { data: newSettings } = await supabase
          .from('user_settings')
          .insert({ current_cumulative_gpa: 0, total_credits_earned: 0, target_gpax: 4.0 })
          .select()
          .single();
        if (newSettings) {
          setSettings(newSettings);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (title: string, credits: number, grade: number) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({ title, credits, grade, semester: 'Current' })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSubjects([data, ...subjects]);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const { error } = await supabase.from('subjects').delete().eq('id', id);

      if (error) throw error;

      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updatedSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const currentSemesterGPA = calculateGPA(subjects);
  const currentSemesterCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glassmorphism p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="glassmorphism p-6 rounded-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
              <Calculator size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">GPA Calculator</h1>
              <p className="text-gray-400 mt-1">Track your academic performance and reach your goals</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <StatsCard
              currentGPA={currentSemesterGPA}
              totalSubjects={subjects.length}
              totalCredits={currentSemesterCredits}
            />

            <SubjectList subjects={subjects} onDelete={handleDeleteSubject} />

            <GPACharts subjects={subjects} currentGPA={currentSemesterGPA} />
          </div>

          <div className="space-y-6">
            <SubjectForm onAdd={handleAddSubject} />

            <GPAXCalculator
              settings={settings}
              currentSemesterGPA={currentSemesterGPA}
              currentSemesterCredits={currentSemesterCredits}
              onUpdateSettings={handleUpdateSettings}
            />
          </div>
        </div>

        <footer className="glassmorphism p-4 rounded-xl text-center">
          <p className="text-gray-400 text-sm">
            Made with React, Tailwind CSS, and Supabase
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
