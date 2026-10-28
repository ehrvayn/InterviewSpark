const ACTIVE_INTERVIEW_KEY = "interviewspark.activeInterviewId";

export const setActiveInterviewId = (interviewId: number) => {
  if (typeof window === "undefined") return;
  if (!Number.isInteger(interviewId) || interviewId <= 0) return;

  try {
    window.localStorage.setItem(ACTIVE_INTERVIEW_KEY, String(interviewId));
  } catch {
    // Storage can be unavailable (private mode, quota, blocked cookies).
  }
};

export const getActiveInterviewId = (): number | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACTIVE_INTERVIEW_KEY);
    if (!raw) return null;

    const interviewId = Number(raw);
    return Number.isInteger(interviewId) && interviewId > 0
      ? interviewId
      : null;
  } catch {
    return null;
  }
};

export const clearActiveInterviewId = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(ACTIVE_INTERVIEW_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
};
