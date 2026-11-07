import { Status, statusConfig } from '@/lib/status'

export default function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = statusConfig[status]

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${classes}`}>{label}</span>
  )
}
