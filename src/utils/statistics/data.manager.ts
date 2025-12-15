import { ShiftService } from '@/services/shift';
import type { ShiftStatisticsData } from './types';
import {
  idbDeleteById,
  idbGetByCompany,
  idbUpsertMany,
  idbUpsertOne,
} from './statistics.idb';

const RAW_TTL_MS = 10 * 60 * 1000;
const lastSyncKey = (companyId: number) => `raw_shift_last_sync:${companyId}`;

class RawDataManager {
  private raw: ShiftStatisticsData[] = [];
  private getCompanyId?: () => string = undefined;
  private active: boolean = false;

  setActive(list: ShiftStatisticsData[]) {
    this.raw = list;
  }

  async getRaw() {
    if (!this.active) return await this.start();
    return this.raw;
  }

  private async start() {
    const now = Date.now();
    const company = Number(this.getCompanyId?.());
    const last = Number(localStorage.getItem(lastSyncKey(company)) ?? 0);
    const isStale = !last || now - last >= RAW_TTL_MS;

    if (!isStale) {
      console.log('[MC] cached');
      const cached = await idbGetByCompany(company);
      this.setActive(cached);
      this.active = true;
      return cached;
    }

    console.log('[MC] backend');
    const res = await ShiftService.statistics();
    if (!res.getStatus()) {
      const cached = await idbGetByCompany(company);
      this.setActive(cached);
      this.active = true;
      return cached;
    }

    const list = (res.getMany() as ShiftStatisticsData[]).filter(
      (s) => s.companyId === company
    );

    await idbUpsertMany(list);
    this.setActive(list);
    this.active = true;
    localStorage.setItem(lastSyncKey(company), String(now));
    return list;
  }

  connect(getCompanyId: () => string) {
    this.getCompanyId = getCompanyId;
    this.start();
  }

  async updateOne(id: number, patch: Partial<ShiftStatisticsData>) {
    const idx = this.raw.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const current = this.raw[idx];
    const merged: ShiftStatisticsData = { ...current, ...patch, id };

    this.raw[idx] = merged;
    await idbUpsertOne(merged);
  }

  async deleteOne(id: number) {
    const idx = this.raw.findIndex((s) => s.id === id);
    if (idx === -1) return;

    this.raw = this.raw.filter((d) => d.id !== id);
    await idbDeleteById(id);
  }
}

export const rawDataManager = new RawDataManager();
