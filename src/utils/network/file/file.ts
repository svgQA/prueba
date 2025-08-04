import { ToastManager } from "@/utils/toast/toast-manager";
import { IExcelGenerate } from "./interface";
import ExcelJS from 'exceljs';

export class fileManager {
    static async downloadFile(urlObj: { url: string }) {
        if (!urlObj?.url) {
            ToastManager.error('s_errorUrl');
            return;
        }

        const url = urlObj.url;

        try {
            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const blob = await response.blob();
            const disposition = response.headers.get('Content-Disposition'); // Extraer nombre desde Content-Disposition si existe
            let filename = 'Report.pdf';

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );
                if (match?.[1]) {
                    filename = match[1].replace(/['"]/g, ''); // limpia comillas si vienen
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            ToastManager.success('s_download_file_success');
        } catch (error) {
            ToastManager.error('s_download_file_error');
        }
    }

    static async generateExcel(
        info: IExcelGenerate[],
        fileName: string
    ) {
        const processedInformation: IExcelGenerate[] = info.map(item => ({
            ...item,
            data: item.data?.map(obj => {
                const { resource, ...rest } = obj;
                return rest;
            }) ?? []
        })).filter(item => item.data && item.data.length > 0);
        const information: IExcelGenerate[] = processedInformation;
        
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Report');

            let currentRow = 1;
            information.forEach((dataSet, index) => {
                if (index > 0) {
                    worksheet.addRow([]);
                    currentRow++;
                }

                if (dataSet.header) {
                    const titleRow = worksheet.addRow([dataSet.header]);
                    titleRow.font = { bold: true, size: 14 };
                    titleRow.alignment = { horizontal: 'center' };
                    currentRow++;
                    worksheet.addRow([]);
                    currentRow++;
                }

                if (dataSet.data && dataSet.data.length > 0) {
                    const allKeys = Array.from(new Set(dataSet.data.flatMap(item => Object.keys(item))));
                    const headerRow = worksheet.addRow(allKeys);
                    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
                    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
                    headerRow.border = {
                        top: { style: 'thin', color: { argb: 'FF000000' } },
                        bottom: { style: 'thin', color: { argb: 'FF000000' } },
                        left: { style: 'thin', color: { argb: 'FF000000' } },
                        right: { style: 'thin', color: { argb: 'FF000000' } }
                    };
                    currentRow++;

                    dataSet.data.forEach((item, idx) => {
                        const row = worksheet.addRow(allKeys.map(key => item[key] ?? ''));
                        row.border = {
                            top: { style: 'thin', color: { argb: 'FF000000' } },
                            bottom: { style: 'thin', color: { argb: 'FF000000' } },
                            left: { style: 'thin', color: { argb: 'FF000000' } },
                            right: { style: 'thin', color: { argb: 'FF000000' } }
                        };
                        // Alternar color de fondo en filas
                        if (idx % 2 === 1) {
                            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
                        }
                        currentRow++;
                    });
                }
            });

            // Auto-ajustar ancho de columnas
            worksheet.columns.forEach(column => {
                let maxLength = 10;
                if (typeof column.eachCell === 'function') {
                    column.eachCell({ includeEmpty: true }, cell => {
                        const cellValue = cell.value ? String(cell.value) : '';
                        maxLength = Math.max(maxLength, cellValue.length);
                    });
                }
                column.width = Math.min(maxLength + 2, 50);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${fileName}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            ToastManager.success('s_download_file_success');
        } catch (error) {
            ToastManager.error('s_download_file_error');
        }
    }
}