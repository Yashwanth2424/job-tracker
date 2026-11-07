export const STATUSES = [
  'SAVED',
  'APPLIED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_DONE',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const

export type Status = (typeof STATUSES)[number]

export const statusConfig: Record<Status, { label: string; classes: string }> = {
  SAVED: { label: 'Saved', classes: 'bg-gray-100 text-gray-600' },
  APPLIED: { label: 'Applied', classes: 'bg-blue-100 text-blue-700' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', classes: 'bg-purple-100 text-purple-700' },
  INTERVIEW_DONE: { label: 'Interview Done', classes: 'bg-indigo-100 text-indigo-700' },
  OFFER: { label: 'Offer', classes: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', classes: 'bg-red-100 text-red-600' },
  WITHDRAWN: { label: 'Withdrawn', classes: 'bg-orange-100 text-orange-700' },
}
