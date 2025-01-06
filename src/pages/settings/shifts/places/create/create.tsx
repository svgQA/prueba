import { Map } from "@/components/common/map/map";
import { FunctionComponent } from "preact";

export const PlaceCreateSettingPage: FunctionComponent = () => {
    return (
        <section className='flex flex-row'>
            <div className='w-full'>
                <h1>Crear nuevo lugar</h1>
            </div>
            <div>
                <Map id='1' name='mapa' />
            </div>
        </section>
    )
}