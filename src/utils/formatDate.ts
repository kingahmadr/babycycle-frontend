export function formatDate(dateString: string) {
  // Parse the input date
  const date = new Date(dateString);
  // Get the year from the input date
  const year = date.getFullYear();
  // Create a new Date object for January 1st of the same year in UTC
  const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  // Convert to ISO string
  return startOfYear.toISOString();
}
