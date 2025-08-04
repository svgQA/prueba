import { ToastManager } from "@/utils/toast/toast-manager";
import { IExcelGenerate } from "./interface";

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
        information: IExcelGenerate[],
        fileName: string
    ) {
        /**
         * TODO: la informacion es el encabezado y los datos y se debe iterar por cuantos datos traiga como si
         * fueran muchas tablas con muchos encabezados.
         * 
         * El nombre del archivo es el nombre con el que se descarga
         */

        console.log('information: ', information);
        console.log('fileName: ', fileName);
    }
}