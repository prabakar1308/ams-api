import { WorksheetUnit } from 'src/master/entities/worksheet-unit';

export function getUnitValue(unit: WorksheetUnit | undefined) {
  let unitName = '';
  if (unit) {
    unitName = unit.brand ? `${unit.value} - ${unit.brand}` : unit.value;
    if (unit.specs) unitName = `${unitName} (${unit.specs})`;
  }
  return unitName;
}
