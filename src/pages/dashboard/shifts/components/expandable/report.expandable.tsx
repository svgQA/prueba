import React from 'react'
import { DateUtils } from '@/utils/utilities/dates'

export interface IReport {
  id: number
  shiftId: number
  description: string
  requestDate: string | null
  date: string
  resource: Array<any>
}

interface ReportInfoProps {
  reports?: IReport[]
  data?: { reports: IReport[] }
  onViewDetails: (report: IReport) => void
}

const ReportInfo: React.FC<ReportInfoProps> = ({
  reports: directReports,
  data,
  onViewDetails,
}) => {
  const reports: IReport[] = directReports ?? data?.reports ?? []

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-200">
        <h2 className="text-base font-medium">Reportes del Turno</h2>
        <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-3 py-1 rounded-full">
          {reports.length} Reporte{reports.length !== 1 && 's'}
        </span>
      </div>

      {/* Lista ligera */}
      <div className="divide-y divide-gray-200">
        {reports.map((report, idx) => {
          const isRequested = !!report.requestDate
          const statusLabel = isRequested ? 'Solicitado' : 'No solicitado'
          const statusColorClass = isRequested ? 'text-green-500' : 'text-red-500'
          const statusIcon = isRequested ? 'vx-icon-324' : 'vx-icon-323'

          const reqDate = report.requestDate
            ? DateUtils.dateToFrontend(report.requestDate, {
                time: true,
                format: 'DD/MM/YYYY HH:mm',
              })
            : '—'
          const repDate = DateUtils.dateToFrontend(report.date, {
            time: true,
            format: 'DD/MM/YYYY HH:mm',
          })
          const attachmentsCount = report.resource?.length ?? 0

          return (
            <div
              key={idx}
              className="grid grid-cols-12 gap-x-4 items-center py-3 text-sm"
            >
              {/* Estado e icono */}
              <div className="col-span-2 flex items-center space-x-2">
                <span className={`vox-icon ${statusIcon} ${statusColorClass}`}></span>
                <p className={`${statusColorClass} font-medium`}>{statusLabel}</p>
              </div>

              {/* Fechas */}
              <div className="col-span-3 space-y-0.5">
                <p className="leading-tight">
                  <span className="font-semibold">Solicitud:</span> {reqDate}
                </p>
                <p className="leading-tight">
                  <span className="font-semibold">Reporte:</span> {repDate}
                </p>
              </div>

              {/* Descripción */}
              <div className="col-span-3">
                <p className="truncate leading-tight">{report.description}</p>
              </div>

              {/* Adjuntos */}
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center bg-cyan-100 text-cyan-800 text-xs font-medium px-3 py-1 rounded-full">
                  <span className="vox-icon vx-icon-006 mr-1"></span>
                  {attachmentsCount}
                </div>
              </div>

              {/* Ver detalles */}
              <div className="col-span-2 text-right">
                <button
                  onClick={() => onViewDetails(report)}
                  className="text-cyan-600 text-xs flex items-center justify-end hover:underline"
                >
                  Ver detalles
                  <span className="ml-1 vox-icon vx-icon-004 text-cyan-600"></span>
                </button>
              </div>
            </div>
          )
        })}

        {reports.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No hay reportes para mostrar
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportInfo
