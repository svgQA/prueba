import { Button } from "@/components/common/button/button";
import { Section } from "@/components/common/section/section";
import { FunctionComponent } from "preact";
import { useLocation } from "wouter";
import { placesData } from "./utils/places.data";
import { Place } from "./utils/places";
import { columns } from "./components/places.columns";
import { Table } from "@/components/common/table/table";
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from "@/components/common/table/interface";

export const PlacesSettingPage: FunctionComponent = () => {
    const [_, navigate] = useLocation();

    const redirect = () => {
        navigate('/rounds/places/create');
    };

    const handleOnClick = (action: IRowAction) => {
        switch (action.action) {
          case ROW_ACTIONS.UPDATE:
            redirect();
            break;
          default:
            break;
        }
    };

    return (
        <Section>
            <Button
                onClick={() => navigate('/rounds/places/create')}
                type='button'
                label='Crear'
                icon='123'
                name='back'
            />
            <Table<Place>
                data={placesData}
                columns={columns}
                pageSize={20}
                visibility={{
                    address: false,
                    city: false,
                    employeeId: false,
                    duration: false,
                }}
                onClickAction={handleOnClick}
                unsearch
            />
        </Section>
    )
}