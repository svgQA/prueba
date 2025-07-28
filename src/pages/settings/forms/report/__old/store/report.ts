import { IReport } from '@/types/form';
// import { computed, signal } from '@preact/signals';

// const buildInitReport = (): IReport => ({
//   title: '',
//   header: false,
//   footer: false,
//   pageBreak: false,
//   flaggedItems: false,
//   actions: false,
//   disclaimer: false,
//   mediaSummary: false,
//   pdfSize: 'A4',
//   thumbnailSize: 'small',
// });
export type ReportKey = keyof IReport;

// const report = signal<IReport>(buildInitReport());
// export const getReport = computed(() => report.value);
// export const setReport = (beport: IReport) => (report.value = beport);
// export const updateReport = (name: ReportKey, value: any = false) => {
//   report.value = {
//     ...report.value,
//     [name]: value,
//   };
// };
