/**
 * Utilitários para manipulação de datas sem problemas de timezone
 */

/**
 * Cria uma data no timezone local (meio-dia) para evitar problemas de conversão UTC
 */
export function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/**
 * Adiciona meses a uma data mantendo o dia do mês fixo
 * Se o dia não existir no mês de destino, usa o último dia do mês
 * @param date Data base
 * @param months Número de meses a adicionar
 * @returns Nova data com os meses adicionados
 */
export function addMonths(date: Date, months: number): Date {
  const originalDay = date.getDate();
  const newDate = new Date(date);
  
  // Adiciona os meses
  newDate.setMonth(newDate.getMonth() + months);
  
  // Se o dia mudou (porque o mês de destino não tem esse dia), ajusta para o último dia do mês anterior
  if (newDate.getDate() !== originalDay) {
    newDate.setDate(0); // Volta para o último dia do mês anterior
  }
  
  return newDate;
}

/**
 * Adiciona 15 dias mantendo sempre o mesmo dia do mês (ex: dia 5 ou dia 20)
 * Usado para pagamentos quinzenais
 */
export function addBiweekly(date: Date, timesAdded: number): Date {
  const originalDay = date.getDate();
  const newDate = new Date(date);
  
  // Para quinzenal, alterna entre o dia original e dia original + 15
  // Ex: Se começou dia 5, vai ser: 5 → 20 → 5 (próximo mês) → 20 → 5...
  if (timesAdded % 2 === 0) {
    // Par: mantém o dia original mas no próximo mês
    newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2));
  } else {
    // Ímpar: adiciona 15 dias (ou ajusta para próximo mês se ultrapassar)
    const targetDay = originalDay + 15;
    const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    
    if (targetDay <= lastDayOfMonth) {
      // Cabe no mesmo mês
      newDate.setDate(targetDay);
      newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2));
    } else {
      // Passa para o próximo mês
      newDate.setMonth(newDate.getMonth() + Math.floor(timesAdded / 2) + 1);
      newDate.setDate(targetDay - lastDayOfMonth);
    }
  }
  
  return newDate;
}

/**
 * Converte uma string de data (YYYY-MM-DD) para Date no horário meio-dia local
 * Evita problemas de timezone ao fazer parsing
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  return createLocalDate(year, month, day);
}

/**
 * Formata uma data para string YYYY-MM-DD sem considerar timezone
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
