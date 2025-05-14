import { worksheetStatus } from 'src/dashboard/enums/worksheet-status.enum';

export function getDateDifference(
  harvestTime: Date | undefined,
  statusId: number,
) {
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

  let timeText = days ? `${days} days ` : '';
  let result = { text: '', status: '' };
  timeText = hours ? `${timeText}${hours} hours ` : timeText;
  timeText = minutes ? `${timeText}${minutes} mins ` : timeText;
  switch (statusId) {
    case Number(worksheetStatus.READY_FOR_STOCKING):
      result = { text: `Created ${timeText} ago`, status: 'warning' };
      break;
    case Number(worksheetStatus.IN_STOCKING):
      if (isPast)
        result = { text: `Harvest - ${timeText} overdue`, status: 'error' };
      else result = { text: `Harvest in ${timeText}`, status: 'success' };
      break;
    case Number(worksheetStatus.READY_FOR_HARVEST):
      result = { text: `Harvest - ${timeText} overdue`, status: 'error' };
      break;
    default:
      break;
  }
  return result;
}
