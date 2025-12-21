import dayjs from 'dayjs';
import { rawDataManager } from './data.manager';
import { ShiftStatisticsData } from './types';
import { defaultThresholds, riskThresholds, roundThresholds } from './constant';
import { classifyStatus, toPercent, toRound } from './utils';
import { setSignalMetric } from '@/store/signals/metric';
import { setSignalMetricShifts } from '@/store/signals/shift';

class MetricsEngine {
  private timer: number | null = null;

  private compute(raw: ShiftStatisticsData[]) {
    const nowMs = Date.now();
    const decimals = 1;

    const totalUsers = new Set<number>();
    const activeUsers = new Set<number>();

    let totalShifts = 0;
    let activeShifts = 0;

    let roundCount = 0;
    let roundActualSum = 0;
    let roundExpectedSum = 0;

    /**
     * METRIC (RISK): Shifts at risk
     * Turnos en progreso que terminan en <= 30 minutos
     * y todavía NO tienen check-in.
     * Sirve para intervención inmediata.
     */
    let shiftsAtRisk = 0;

    /**
     * METRIC (ROUND RAW):
     * Datos crudos por turno con ronda para:
     * - desviaciones
     * - métricas de riesgo
     * - carga futura
     */
    const roundRaw: Array<{
      roundPct: number;
      roundPctTime: number;
      totalPoints: number;
      expectedPoints: number;
    }> = [];

    for (let i = 0; i < raw.length; i++) {
      const s = raw[i];
      const startMs = dayjs.utc(s.start).valueOf();
      const endMs = dayjs.utc(s.end).valueOf();

      let active = false;
      let roundPctTime = 0;
      let risk = 0;

      if (startMs <= nowMs && nowMs < endMs) {
        totalShifts++;
        active = true;

        const duration = Math.max(1, endMs - startMs);
        const elapsed = Math.max(0, Math.min(nowMs - startMs, duration));
        const timeRatio = Math.max(0, Math.min(elapsed / duration, 1));
        /**
         * METRIC: Shifts
         */
        const isActiveShift = Boolean(s.hasCheckIn);
        if (isActiveShift) activeShifts++;

        /**
         * METRIC: Users
         */
        totalUsers.add(s.employeeId);
        if (isActiveShift) activeUsers.add(s.employeeId);

        /**
         * METRIC (RISK): Shifts at risk
         * Turnos sin check-in y a menos de 30 minutos de finalizar
         */
        if (!s.hasCheckIn) {
          risk = toRound(timeRatio * 100, 0);
          if (risk >= 70) {
            shiftsAtRisk++;
          }
        }

        /**
         * METRIC: Rounds
         * Se calcula sobre turnos que deberían estar realizando ronda
         * (roundId > 0), independientemente de si hicieron check-in.
         */
        if (s.roundId && s.roundId > 0) {
          roundPctTime = timeRatio * 100;

          const totalPoints = (s.pointsAmount ?? 0) * (s.frequency ?? 0);
          const expectedPoints = totalPoints * timeRatio;

          roundCount++;
          roundActualSum += s.roundPct ?? 0;
          roundExpectedSum += roundPctTime;

          roundRaw.push({
            roundPct: s.roundPct ?? 0,
            roundPctTime,
            totalPoints,
            expectedPoints,
          });
        }
      }

      raw[i] = { ...raw[i], roundPctTime, active, risk };
    }

    /**
     * METRIC: Users
     * Porcentaje de usuarios activos respecto a los esperados
     */
    const userTotal = totalUsers.size;
    const userActive = activeUsers.size;
    const userPercent = toPercent(userActive, userTotal, decimals);

    /**
     * METRIC: Shifts
     * Porcentaje de turnos activos respecto a los esperados
     */
    const shiftPercent = toPercent(activeShifts, totalShifts, decimals);

    /**
     * METRIC: Rounds (special)
     * - Actual: promedio de roundPct
     * - Expected: promedio de avance esperado por tiempo
     * - Balance: desviación normalizada (50 = perfecto)
     */
    const roundActualAvg = roundCount ? roundActualSum / roundCount : 0;
    const roundExpectedAvg = roundCount ? roundExpectedSum / roundCount : 0;

    const roundBalance = 50 + (roundExpectedAvg - roundActualAvg) / 2;

    const roundBalanceRounded = Math.round(roundBalance * 10) / 10;
    const roundActualRounded = Math.round(roundActualAvg * 10) / 10;
    const roundExpectedRounded = Math.round(roundExpectedAvg * 10) / 10;

    /**
     * METRIC (RISK): Shifts behind schedule
     * Turnos cuya ejecución real está por debajo de lo esperado
     * por un margen de tolerancia.
     */
    const ROUND_TOLERANCE = 10;

    const shiftsBehind = roundRaw.filter(
      (r) => r.roundPct < r.roundPctTime - ROUND_TOLERANCE
    );

    const shiftsBehindCount = shiftsBehind.length;
    const shiftsBehindPercent = toPercent(
      shiftsBehindCount,
      roundCount,
      decimals
    );

    /**
     * METRIC (LOAD): Operational load next 30 minutes
     * Cantidad de puntos que deberían ejecutarse en el corto plazo.
     */
    let pointsNext30 = 0;
    for (const r of roundRaw) {
      const remaining = r.totalPoints - r.expectedPoints;
      pointsNext30 += Math.max(0, Math.min(remaining, r.totalPoints * 0.25));
    }

    /**
     * FINAL METRIC OBJECT
     */
    const metric = {
      user: {
        values: [userPercent, userTotal, userActive, userTotal - userActive],
        status: classifyStatus(userPercent, defaultThresholds),
      },
      shift: {
        values: [
          shiftPercent,
          totalShifts,
          activeShifts,
          shiftsAtRisk,
          toPercent(shiftsAtRisk, totalShifts, decimals),
        ],
        status: classifyStatus(shiftPercent, defaultThresholds),
      },
      round: {
        values: [
          roundBalanceRounded,
          roundActualRounded,
          roundExpectedRounded,
          roundRaw.length,
        ],
        status: classifyStatus(Math.abs(roundBalance - 50), roundThresholds),
      },

      /**
       * CARD: Rounds behind schedule
       * Riesgo de incumplimiento de ronda
       */
      roundRisk: {
        values: [shiftsBehindCount, shiftsBehindPercent, ROUND_TOLERANCE],
        status: classifyStatus(shiftsBehindPercent, riskThresholds),
      },

      /**
       * CARD: Operational load
       * Carga inmediata de trabajo
       */
      load: {
        values: [Math.round(pointsNext30), roundCount],
        status: 'NEUTRAL',
      },
    };

    setSignalMetric(metric);
    setSignalMetricShifts(raw);
    rawDataManager.setActive(raw);
  }

  async recalculate() {
    // console.log('METRIC: ');
    const raw = await rawDataManager.getRaw();
    this.compute(raw);
  }

  connect(intervalMs = 1 * 60 * 1000) {
    if (this.timer) return; // window.clearInterval(this.timer);
    this.timer = window.setInterval(() => this.recalculate(), intervalMs);
  }

  disconnect() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }
}

export const metricsEngine = new MetricsEngine();
