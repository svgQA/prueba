import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export type TimeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';
export type ValidDate = string | Date;

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
   * Crea una fecha UTC ISO combinando la hora dada ('HH:mm') con la fecha actual en la zona horaria configurada.
   * @param hourString Hora en formato 'HH:mm' (o 'HH:mm:ss')
   * @returns ISO string en UTC: 'YYYY-MM-DDTHH:mm:00.000Z'
   */
  static createDateFromHour(
    hourString: string = '1970-01-01T24:00:00.000Z',
    back = false
  ): string {
    if (!hourString) return '23:59';
    const timeOnlyMatch = hourString.match(/T(\d{2}:\d{2}(?::\d{2})?)/);
    const timeOnly = timeOnlyMatch ? timeOnlyMatch[1] : hourString;
    const [hour, minute, second = '0'] = timeOnly.split(':').map(Number);

    const localToday = dayjs
      .utc()
      // .tz(DateUtils.timeZone)
      .set('hour', hour)
      .set('minute', minute)
      .set('second', +second)
      .set('millisecond', 0);

    if (back) {
      return localToday.utc().toISOString();
    }

    return localToday.format();
  }

  /**
   * Convierte una fecha local a string ISO UTC para backend.
   */
  static toUTCISOStringFromLocal(
    dateInput: ValidDate,
    format: 'time' | 'date' = 'date'
  ): string {
    if (format === 'time') {
      return dayjs(dateInput).utc().format('HH:mm');
    }
    return dayjs(dateInput).utc().toISOString();
  }

  static dateToBackend(
    dateInput: ValidDate,
    format: 'time' | 'date' = 'date'
  ): string {
    return this.toUTCISOStringFromLocal(dateInput, format);
  }

  /**
   * Toma una hora en formato UTC (como '1970-01-01T18:23:00.000Z'),
   * extrae la hora y la aplica sobre la fecha actual en la zona horaria configurada,
   * devolviendo la hora local correcta en formato "HH:mm".
   */
  static hourToFrontend(dateUTC: ValidDate = '00:00'): string {
    const date = this.createDateFromHour(dateUTC as string, true);
    return this.fromUTCToLocal(date, 'HH:mm');
  }

  /**
   * Convierte fecha UTC a formato local con zona configurada.
   */
  static fromUTCToLocal(
    dateUTC: ValidDate,
    format = 'YYYY-MM-DD HH:mm'
  ): string {
    return dayjs.utc(dateUTC).tz(DateUtils.timeZone).format(format);
  }

  static _dateToFrontend(dateInput?: ValidDate): Dayjs {
    return dayjs.utc(dateInput).tz(DateUtils.timeZone);
  }

  static dateToFrontend(
    dateInput?: ValidDate,
    options?: {
      time?: boolean;
      mode?: '12' | '24';
      format?: string;
    }
  ): string {
    if (!dateInput) return '';
    if (options?.format) {
      return this.fromUTCToLocal(dateInput, options.format);
    }

    if (options?.time) {
      return this.fromUTCToLocal(
        dateInput,
        options?.mode === '12' ? 'DD/MM/YYYY hh:mm A' : 'DD/MM/YYYY HH:mm'
      );
    }

    const output = this.fromUTCToLocal(
      dateInput,
      options?.mode === '12' ? 'DD/MM/YYYY' : 'DD/MM/YYYY'
    );
    return output;
  }

  static dateToInput(dateInput?: ValidDate): string {
    if (!dateInput) return '';
    return this.dateFormat(dateInput);
  }

  /**
   * Convierte entre zonas arbitrarias.
   */
  static convertBetweenTimeZones(
    dateInput: ValidDate,
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

  static dateFormat(date: ValidDate, format = 'YYYY-MM-DD HH:mm:ss'): string {
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
    actualDate: ValidDate,
    scheduledDate: ValidDate,
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
    start: ValidDate,
    end: ValidDate
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

  static getRelativeTime(date: ValidDate): string {
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
