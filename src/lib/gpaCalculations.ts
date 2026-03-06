import { Subject } from './supabase';

export const calculateGPA = (subjects: Subject[]): number => {
  if (subjects.length === 0) return 0;

  const totalPoints = subjects.reduce((sum, subject) => {
    return sum + (subject.grade * subject.credits);
  }, 0);

  const totalCredits = subjects.reduce((sum, subject) => {
    return sum + subject.credits;
  }, 0);

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const calculateRequiredGPA = (
  currentCumulativeGPA: number,
  totalCreditsEarned: number,
  targetGPA: number,
  newSemesterCredits: number
): number => {
  if (newSemesterCredits === 0) return 0;

  const currentTotalPoints = currentCumulativeGPA * totalCreditsEarned;
  const targetTotalPoints = targetGPA * (totalCreditsEarned + newSemesterCredits);
  const requiredPoints = targetTotalPoints - currentTotalPoints;

  return requiredPoints / newSemesterCredits;
};

export const getLetterGrade = (gpa: number): string => {
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'B+';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.5) return 'C+';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.5) return 'D+';
  if (gpa >= 1.0) return 'D';
  return 'F';
};

export const gradeOptions = [
  { value: 4.0, label: 'A (4.0)' },
  { value: 3.5, label: 'B+ (3.5)' },
  { value: 3.0, label: 'B (3.0)' },
  { value: 2.5, label: 'C+ (2.5)' },
  { value: 2.0, label: 'C (2.0)' },
  { value: 1.5, label: 'D+ (1.5)' },
  { value: 1.0, label: 'D (1.0)' },
  { value: 0.0, label: 'F (0.0)' },
];
