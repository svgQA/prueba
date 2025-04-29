import { Button } from "@/components/common/button/button"
import MapLibrePointsMap from "@/components/common/map/MapLibrePointsMap"
import { Memo } from "../../utils/memos"

const SupervisorInfo = ({ memo }: { memo: Memo }) => {
  const supervisorData = {
    id: memo?.extraData.company.name,
    servicioRelacionado: memo?.novelty.name,
    actualizadoPor: memo?.updatedAt,
    lugar: memo?.extraData.place.address,
    cliente: memo?.extraData.client.name,
    ciudad: memo?.extraData.city.name,
    supervisorPhoto: memo?.resource.images[0],
    clientPhoto: memo?.resource.images[0],
    description: memo?.description,
    company: memo?.extraData.company.name,
    Address: memo?.extraData.place.address,
  }

  return (
    <div className="w-full bg-white p-3">
      <div className="flex flex-row justify-between">
        {/* Sección izquierda - Descripción y botones */}
        <div className="w-[18%]">
          <p className="text-xs text-gray-700 mb-3 leading-tight">
            {supervisorData.description}
          </p>
          <div className="flex gap-0.5">
            <Button
              name="button"
              label="Tarea"
              className="bg-primary-opacity text-primary border border-primary rounded-full text-sm"
              border={true}
            />
            <Button
              name="button"
              label="Tarea"
              className="bg-primary-opacity text-primary border border-primary rounded-full text-sm"
              border={true}
            />
            <Button
              name="button"
              label="Tarea"
              className="bg-primary-opacity text-primary border border-primary rounded-full text-sm"
              border={true}
            />
          </div>
        </div>

        {/* Sección central - Información del supervisor */}
        <div className="w-[17%]">
          <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-0.5 text-xs">
            <p className="font-medium">Supervisor:</p>
            <p>{supervisorData.id}</p>

            <p className="font-medium">Servicio relacionado:</p>
            <p>{supervisorData.servicioRelacionado}</p>

            <p className="font-medium">Actualizado por:</p>
            <p>{supervisorData.actualizadoPor}</p>

            <p className="font-medium">Lugar:</p>
            <p>{supervisorData.lugar}</p>
          </div>
        </div>

        {/* Sección central - Información del cliente */}
        <div className="w-[17%]">
          <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-0.5 text-xs">
            <p className="font-medium">Cliente:</p>
            <p>{supervisorData.cliente}</p>

            <p className="font-medium">Ciudad:</p>
            <p>{supervisorData.ciudad}</p>

            <p className="font-medium">Compañía:</p>
            <p>{supervisorData.company}</p>

            <p className="font-medium">Dirección:</p>
            <p className="leading-tight">{supervisorData.Address}</p>
          </div>
        </div>

        {/* Sección derecha - Mapa y fotos */}
        <div className="w-[40%]">
          <div className="flex gap-1 h-24">
            {/* Mapa a la izquierda */}
            <div className="w-1/2 rounded-md overflow-hidden border border-gray-200">
              <MapLibrePointsMap
                name="map-points"
                pointsRef={[
                  {
                    latitude: memo?.extraData.place.latitude,
                    longitude: memo?.extraData.place.longitude,
                    name: memo?.extraData.place.address,
                    image: memo?.resource.images[0],
                  },
                ]}
                sendPoints={() => { }}
                height="100%"
                disablePointSelection={true}
              />
            </div>

            {/* Imágenes a la derecha */}
            <div className="w-1/2 flex flex-wrap gap-1">
              <div className="w-[48%] h-[48%] border rounded-md overflow-hidden bg-gray-100">
                {/* Imagen con contenido */}
                <img
                  src={supervisorData.supervisorPhoto}
                  alt="Supervisor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[48%] h-[48%] border border-dashed rounded-md bg-gray-50"></div>
              <div className="w-[48%] h-[48%] border border-dashed rounded-md bg-gray-50"></div>
              <div className="w-[48%] h-[48%] border border-dashed rounded-md bg-gray-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupervisorInfo
