export function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(days / 365)}y`;
}

export function formatDateRange(startDate, endDate, isCurrent) {
  if (!startDate) return '';
  const format = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const start = format(startDate);
  const end = isCurrent ? 'Present' : (endDate ? format(endDate) : 'Present');
  return `${start} - ${end}`;
}
