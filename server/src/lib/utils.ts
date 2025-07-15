import { TripDocument } from '../models/TripModel';

export function parseMarkdownToJson(
  markdownText: string | undefined
): Partial<TripDocument> | null {
  const regex = /```json\n([\s\S]+?)\n```/;
  const match = markdownText?.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  console.error('No valid JSON found in markdown text.');
  return null;
}

export function extractJson(raw: string) {
  try {
    // Strip any markdown if Gemini still adds it
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw;
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Gemini response was not valid JSON');
  }
}

// utils/dateRanges
export const getDateRanges = () => {
  const now = new Date();

  // Today
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  // Yesterday
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  // This week (Monday to today)
  const thisWeekStart = new Date();
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  thisWeekStart.setHours(0, 0, 0, 0);

  // Last week (Monday to Sunday)
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setMilliseconds(-1);

  // This month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Last month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  return {
    today: { start: todayStart, end: todayEnd },
    yesterday: { start: yesterdayStart, end: yesterdayEnd },
    thisWeek: { start: thisWeekStart, end: new Date() },
    lastWeek: { start: lastWeekStart, end: lastWeekEnd },
    thisMonth: { start: thisMonthStart, end: thisMonthEnd },
    lastMonth: { start: lastMonthStart, end: lastMonthEnd },
  };
};
