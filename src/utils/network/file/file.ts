import { ToastManager } from '@/utils/toast/toast-manager';
import { IExcelGenerate } from './interface';
import ExcelJS from 'exceljs';
import i18n from '@/i18n';
import { IPresignedRequest } from '@/types/file';
import { cdn_service_url } from '@/env.config';

export class fileManager {
  static getUrl(
    tenantId: string,
    companyId: string,
    file: IPresignedRequest
  ): string {
    return `${cdn_service_url}/${tenantId}/${companyId}/${file.area}/${file.uuid}-${file.name}`;
  }

  static async downloadFile(
    urlObj: { url: string },
    filename: string = 'Report.pdf'
  ) {
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

  static async generateExcel(info: IExcelGenerate[], fileName: string) {
    const processedInformation: IExcelGenerate[] = info
      .map((item) => ({
        header: i18n.t(item.header),
        data:
          item.data?.map((obj) => {
            const { resource, ...rest } = obj;
            return rest;
          }) ?? [],
      }))
      .filter((item) => item.data && item.data.length > 0);
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

        // Header principal (título)
        let allKeys: string[] = [];
        if (dataSet.data && dataSet.data.length > 0) {
          allKeys = Array.from(
            new Set(dataSet.data.flatMap((item) => Object.keys(item)))
          );
        }
        if (dataSet.header) {
          // Crear una fila vacía con el mismo número de columnas que allKeys para el título
          const titleRow = worksheet.addRow(Array(allKeys.length).fill(''));
          // Colocar el texto del header en la primera celda
          titleRow.getCell(1).value = dataSet.header;
          // Combinar el rango de columnas con datos (horizontalmente)
          if (allKeys.length > 1) {
            worksheet.mergeCells(
              `A${titleRow.number}:${String.fromCharCode(65 + allKeys.length - 1)}${titleRow.number}`
            );
          }
          // Formato centrado y color
          titleRow.getCell(1).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          titleRow.getCell(1).font = {
            bold: true,
            size: 16,
            color: { argb: 'FF4472C4' },
          };
          currentRow++;
          // No agregamos fila vacía aquí
        }

        if (allKeys.length > 0) {
          // Encabezado de columnas
          const headerRow = worksheet.addRow(allKeys);
          headerRow.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' },
            size: 12,
          };
          headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
          // Solo aplicar el fondo azul a las celdas con datos
          allKeys.forEach((_, idx) => {
            const cell = headerRow.getCell(idx + 1);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF4472C4' },
            };
            cell.border = {
              top: { style: 'medium', color: { argb: 'FF4472C4' } },
              bottom: { style: 'medium', color: { argb: 'FF4472C4' } },
              left: { style: 'medium', color: { argb: 'FF4472C4' } },
              right: { style: 'medium', color: { argb: 'FF4472C4' } },
            };
          });
          currentRow++;

          dataSet.data.forEach((item, idx) => {
            const row = worksheet.addRow(allKeys.map((key) => item[key] ?? ''));
            row.alignment = { horizontal: 'center', vertical: 'middle' };
            row.border = {
              top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
              right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            };
            // Alternar color de fondo en filas
            row.fill =
              idx % 2 === 0
                ? {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' },
                  }
                : {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF2F2F2' },
                  };
            currentRow++;
          });
        }
      });

      // Ajustar ancho de columnas según el contenido máximo de cada columna
      worksheet.columns.forEach((column, _i) => {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? String(cell.value) : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = Math.min(maxLength + 2, 30); // Limita a 30 para evitar columnas muy largas
      });

      // Ajustar la selección visual de celdas (centrado y bordes)
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
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

  static getExtensionFile(file: IPresignedRequest): string | undefined {
    const mimeToExtension: { [key: string]: string } = {
      'text/csv': 'csv',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'text/plain': 'txt',
      'application/json': 'json',
    };

    const extension = mimeToExtension[file.type] || 'unknown';

    if (extension === 'unknown') {
      ToastManager.error(
        'Tipo de archivo desconocido. No se puede descargar con la extensión correcta.'
      );
      return;
    }

    return extension;
  }
}
