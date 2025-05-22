import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export type TimeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

export class DateUtils {
  private static timeZone: string =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  /**
   * Establece una zona horaria personalizada.
   * @param tz Ejemplo: "America/Bogota"
   */
  static setTimeZone(tz: string) {
    DateUtils.timeZone = tz;
  }

  /**
   * Devuelve la zona horaria actual.
   */
  static getTimeZone(): string {
    return DateUtils.timeZone;
  }

  /**
   * Convierte una fecha local a string ISO UTC para backend.
   */
  static toUTCISOStringFromLocal(
    dateInput: string | Date,
    format: 'time' | 'date' = 'date'
  ): string {
    if (format === 'time') {
      return dayjs(dateInput).utc().format('HH:mm');
    }
    return dayjs(dateInput).utc().toISOString();
  }

  static dateToBackend(
    dateInput: string | Date,
    format: 'time' | 'date' = 'date'
  ): string {
    return this.toUTCISOStringFromLocal(dateInput, format);
  }

  static dateToFrontend(
    dateInput?: string | Date,
    options?: {
      time?: boolean;
      mode?: '12' | '24';
      format?: string;
    }
  ): string {
    if (!dateInput) return '';

    if (options?.format) {
      console.log(options);
      return this.fromUTCToLocal(dateInput, options.format);
    }

    if (options?.time) {
      return this.fromUTCToLocal(
        dateInput,
        options?.mode === '12' ? 'DD/MM/YYYY hh:mm A' : 'DD/MM/YYYY HH:mm'
      );
    }
    return this.fromUTCToLocal(
      dateInput,
      options?.mode === '12' ? 'DD/MM/YYYY' : 'DD/MM/YYYY'
    );
  }

  static dateToInput(dateInput?: string | Date): string {
    if (!dateInput) return '';
    return this.dateFormat(dateInput);
  }

  /**
   * Convierte fecha UTC a formato local con zona configurada.
   */
  static fromUTCToLocal(
    dateUTC: string | Date,
    format = 'YYYY-MM-DD HH:mm'
  ): string {
    return dayjs.utc(dateUTC).tz(DateUtils.timeZone).format(format);
  }

  /**
   * Convierte entre zonas arbitrarias.
   */
  static convertBetweenTimeZones(
    dateInput: string | Date,
    fromTZ: string,
    toTZ: string,
    format = 'YYYY-MM-DD HH:mm'
  ): string {
    return dayjs.tz(dateInput, fromTZ).tz(toTZ).format(format);
  }

  /**
   * Devuelve la fecha actual en UTC con formato personalizado.
   */
  static nowUTCFormatted(format = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs().utc().format(format);
  }

  /**
   * Devuelve la fecha actual en zona horaria configurada con formato.
   */
  static nowLocalFormatted(format = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs().tz(DateUtils.timeZone).format(format);
  }

  /**
   * Devuelve un objeto `Date` con la hora actual en UTC.
   */
  static nowUTCDate(): Date {
    return dayjs().utc().toDate();
  }

  /**
   * Devuelve un string ISO UTC de la hora actual.
   */
  static nowUTCISOString(): string {
    return dayjs().utc().toISOString();
  }

  static dateFormat(
    date: string | Date,
    format = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    return dayjs(date).format(format);
  }

  /**
   * Calcula el estado de una fecha comparada con una fecha programada
   * @param actualDate Fecha real del evento
   * @param scheduledDate Fecha programada
   * @param type Tipo de comparación (start/end)
   * @param toleranceMinutes Tolerancia en minutos (por defecto 10)
   */
  static getTimeStatus(
    actualDate: string | Date | null | undefined,
    scheduledDate: string | Date,
    type: 'start' | 'end' = 'start',
    toleranceMinutes: number = 10
  ): TimeStatus {
    if (!actualDate) return 'default';

    const actual = dayjs(actualDate);
    const scheduled = dayjs(scheduledDate);
    const before = scheduled.subtract(toleranceMinutes, 'minute');
    const after = scheduled.add(toleranceMinutes, 'minute');

    if (type === 'start') {
      if (actual.isBefore(before)) return 'success';
      if (actual.isAfter(after)) return 'info';
      return 'warning';
    } else {
      if (actual.isBefore(before)) return 'warning';
      if (actual.isAfter(after)) return 'error';
      return 'success';
    }
  }

  /**
   * Compara dos fechas y retorna la diferencia en horas y minutos
   */
  static getTimeDifference(
    start: string | Date,
    end: string | Date
  ): { hours: number; minutes: number; miliseconds: number } {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const diffMs = endTime.diff(startTime);
    const duration = dayjs.duration(diffMs);

    return {
      hours: Math.floor(duration.asHours()),
      minutes: duration.minutes(),
      miliseconds: duration.asMilliseconds(),
    };
  }

  static getRelativeTime(date: string | Date): string {
    return dayjs(date).fromNow();
  }

  static calculateTaskDate(taskTime: string, start: string, end: string) {
    const taskHour = dayjs(taskTime).hour();
    const taskMinute = dayjs(taskTime).minute();
    const startDay = dayjs(start);
    const endDay = dayjs(end);

    const startDate = startDay.startOf('day');
    const endDate = endDay.startOf('day');

    if (!startDate.isSame(endDate, 'day')) {
      const startHour = startDay.hour();
      const endHour = endDay.hour();

      if (taskHour >= startHour) {
        return startDay.set('hour', taskHour).set('minute', taskMinute);
      }

      if (taskHour <= endHour) {
        return endDay.set('hour', taskHour).set('minute', taskMinute);
      }
    }

    return startDay.set('hour', taskHour).set('minute', taskMinute);
  }
}
