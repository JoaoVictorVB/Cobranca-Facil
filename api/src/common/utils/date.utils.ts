export function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function addMonths(date: Date, months: number): Date {
  const originalDay = date.getDate();
  const newDate = new Date(date);
  
  newDate.setMonth(newDate.getMonth() + months);
  
  if (newDate.getDate() !== originalDay) {
    newDate.setDate(0);
  }
  
  return newDate;
}

export function addBiweekly(date: Date, timesAdded: number): Date {
  const originalDay = date.getDate();
  const newDate = new Date(date);
  
  if (timesAdded % 2 === 0) {
    newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2));
  } else {
    const targetDay = originalDay + 15;
    const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    
    if (targetDay <= lastDayOfMonth) {
      newDate.setDate(targetDay);
      newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2));
    } else {
      newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2) + 1);
      newDate.setDate(targetDay - lastDayOfMonth);
    }
  }
  
  return newDate;
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  return createLocalDate(year, month, day);
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
