type interviewsType = {
  name: string;
  id: string;
  createdAt: Date;
  type: string;
  role: string;
  difficultyLevel: string;
  isCompleted: boolean | null;
  userId?: string;
}[];

export const FetchMockInterviews = async () => {
  // Fetch all mock interviews (created by anyone)
  const res = await fetch(`/api/interview/get-all-mock`);
  const data: interviewsType = await res.json();
  return data.filter((x) => !x.isCompleted);
};

export const FetchInterviewHistory = async () => {
  // Fetch only user's own interviews (completed)
  const res = await fetch(`/api/interview/getall`);
  const data: interviewsType = await res.json();
  return data.filter((x) => x.isCompleted);
};

// Scheduled interviews for HR dashboard create-interview tab
export type ScheduledInterviewType = {
  id: string;
  name: string;
  scheduledAt: string | null;
  expiresAt: string | null;
  isCompleted: boolean | null;
  status: 'COMPLETED' | 'EXPIRED' | 'PENDING';
  user: { name: string | null; email: string };
}[];

export const FetchScheduledInterviews = async () => {
  const res = await fetch(`/api/interview/scheduled`);
  if (!res.ok) {
    throw new Error('Failed to fetch scheduled interviews');
  }
  const data: ScheduledInterviewType = await res.json();
  return data;
};

// Fetch all users for HR
export const FetchAllUsers = async () => {
  const res = await fetch(`/api/users/getall`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await res.json();
  return data;
};
