export function getDateDifference(harvestTime: Date | undefined) {
  let isPast = true;
  if (!harvestTime) return undefined;
  let diff = 0;
  if (harvestTime > new Date()) {
    isPast = false;
    diff = harvestTime.getTime() - new Date().getTime();
  } else diff = new Date().getTime() - harvestTime.getTime();
  const days = Math.floor(diff / (60 * 60 * 24 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
  const minutes =
    Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);

  const result = days ? `${days} days ` : '';
  return { text: `${result}${hours} hours ${minutes} mins`, isPast };
}
