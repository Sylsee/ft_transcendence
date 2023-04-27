export function formatTime(timeInMilliseconds: number): string {
  const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
  const minutes = Math.floor((timeInMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((timeInMilliseconds / (1000 * 60 * 60)) % 24);

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours} hours, `;
  }

  if (hours > 0 || minutes > 0) {
    formattedTime += `${minutes} minutes and `;
  }

  formattedTime += `${seconds} seconds`;

  return formattedTime.trim();
}
