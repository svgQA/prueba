import { FunctionalComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ShiftService } from '@/services';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { columns } from './components/shift.columns';
import { IShiftResponse } from '@/types/shift/activity';

import { GeneralTask, Task, User, ViewMode, } from '@/components/compose/gantt/types/public-types';
import dayjs from 'dayjs';
import { ViewSwitcher } from './components/swicher.gantt';
import { Gantt } from '@/components/compose/gantt';
import { TaskForm } from './components/updaser.modal';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button';

enum VIEW_NAME {
  TABLE,
  CALENDAR,
  SCHEDULER,
}

export const ShiftsPage: FunctionalComponent = () => {
  const currentView = useSignal<VIEW_NAME>(VIEW_NAME.TABLE)
  const showModal = useSignal<boolean>(false)
  const shifts = useSignal<IShiftResponse[]>([])

  const [isChecked, setIsChecked] = useState(true)
  const [view, setView] = useState<ViewMode>(ViewMode.QuarterDay)

  const [taskSelected, setTaskSelected] = useState<Task>()
  const [userSelected, setUserSelected] = useState<User>()
  const [selectedButton, setSelectedButton] = useState<VIEW_NAME>(VIEW_NAME.TABLE)

  const startDate = dayjs().subtract(4, "day").toDate()
  const endDate = dayjs(startDate).add(1, "week").toDate()
  const [ganttShifts, setGanttShifts] = useState<GeneralTask>({
    startDate,
    endDate,
    users: [],
  })

  const getShiftHandler = async () => {
    const response = await ShiftService.get_all({ page: 1, items: 1000 })
    if (!response.getStatus()) return
    shifts.value = response.getMany()
  }

  const columnWidth = useMemo(() => {
    if (view === ViewMode.Month) return 300
    if (view === ViewMode.Week) return 250
    return 60
  }, [view])

  const getGanttHandler = async () => {
    const response = await ShiftService.get_gantt({
      page: 1,
      items: 100,
      start: startDate.toISOString(),
    })
    if (!response.getStatus()) return
    setGanttShifts((prev) => ({
      ...prev,
      users: response.getMany(),
    }))
  }

  useEffect(() => {
    document.title = "VX - Shift Service"
    getShiftHandler()
  }, [])

  useEffect(() => {
    if (currentView.value === VIEW_NAME.SCHEDULER) {
      getGanttHandler()
    }
  }, [currentView.value])

  useEffect(() => {
    setSelectedButton(currentView.value)
  }, [])

  const handleViewChange = useCallback((view: VIEW_NAME) => {
    currentView.value = view
    setSelectedButton(view)
  }, [])

  const buttonMenu = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          name="button-change-table"
          onClick={() => {
            handleViewChange(VIEW_NAME.TABLE)
            setSelectedButton(VIEW_NAME.TABLE)
          }}
          rounded={false}
          className={
            selectedButton === VIEW_NAME.TABLE
              ? "bg-primary-opacity border-2 border-primary p-2"
              : "border-2 border-primary p-2"
          }
          icon="320"
        />
        <Button
          name="button-change-table"
          onClick={() => {
            handleViewChange(VIEW_NAME.SCHEDULER)
            setSelectedButton(VIEW_NAME.SCHEDULER)
          }}
          rounded={false}
          className={
            selectedButton === VIEW_NAME.SCHEDULER
              ? "bg-primary-opacity border-2 border-primary p-2"
              : "border-2 border-primary p-2"
          }
          icon="330"
        />
        <Button
          name="button-change-table"
          onClick={() => {
            handleViewChange(VIEW_NAME.CALENDAR)
            setSelectedButton(VIEW_NAME.CALENDAR)
          }}
          rounded={false}
          className={
            selectedButton === VIEW_NAME.CALENDAR
              ? "bg-primary-opacity border-2 border-primary p-2"
              : "border-2 border-primary p-2"
          }
          icon="331"
        />
        <Button name="button-change-table" rounded={false} className="border-2 border-primary p-2" icon="314" />
        <Button
          name="button-change-table"
          label="Supervisión Remota"
          className="bg-primary text-white py-1 rounded-full px-4"
        />
      </div>
    ),
    [selectedButton],
  )

  const handleTaskChange = useCallback(
    (_: Task) => {
      if (taskSelected) {
        // setTaskSelected(() => ({ ...taskSelected, ...task }));
      }
    },
    [shifts],
  )

  const handleDblClick = useCallback((task: Task) => {
    setTaskSelected(() => task)
    showModal.value = true
  }, [])

  const handleClick = useCallback((/* task: Task */) => {
    // taskSelected.value = task;
    // showModal.value = true;
  }, [])

  const handleCreacteNewShift = () => {
    cleanSelectedData()
    toggleModal()
  }

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  const handleUserClick = useCallback(
    (id: string | number) => {
      const selectedUser = ganttShifts.users.find((user) => user.id === id)
      if (selectedUser) {
        setUserSelected(selectedUser)
        showModal.value = true
      }
    },
    [ganttShifts.users],
  )

  const handleTaskDelete = useCallback((task: Task) => {
    window.confirm("Are you sure about " + task.name + " ?")
  }, [])

  const handlOnCloseModal = useCallback(() => {
    cleanSelectedData()
    toggleModal()
  }, [])

  const cleanSelectedData = useCallback(() => {
    setUserSelected(undefined)
    setTaskSelected(undefined)
  }, [])

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CardData title="Turnos Totales Hoy" count={530} subtitle="" color="text-secondary" icon="054" />

        <CardData title="Turnos En Curso" count="50%" subtitle="" color="text-primary" icon="052" />

        <CardData title="Turnos Finalizados" count="30%" subtitle="" color="text-error" icon="015" />
      </div>

      {currentView.value === VIEW_NAME.TABLE && (
        <Table<IShiftResponse>
          data={shifts.value}
          columns={columns}
          pageSize={20}
          button={buttonMenu}
          visibility={{
            servicePlaceAddress: false,
            city: false,
            employeeId: false,
            duration: false,
            userEmail: false,
            userPhone: false,
            serviceRound: false,
          }}
        />
      )}

      {currentView.value === VIEW_NAME.SCHEDULER && (
        <div className="max-h-screen">
          <div className="py-2 flex flex-row justify-between px-1 items-center">
            <div className="flex flex-row items-center justify-between">
              {buttonMenu}
              <button
                className="mx-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleCreacteNewShift}
              >
                Create
              </button>
            </div>
            <ViewSwitcher
              onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
            />
          </div>
          <Gantt
            tasks={ganttShifts}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onDoubleClick={handleDblClick}
            onUserClick={handleUserClick}
            onClick={handleClick}
            listCellWidth={isChecked ? "155px" : ""}
            columnWidth={columnWidth}
          />
        </div>
      )}

      <TaskForm
        // initialValues={initialValues}
        closed={showModal.value}
        onClose={handlOnCloseModal}
        posSave={getGanttHandler}
        userSelected={userSelected}
        taskSelected={taskSelected}
      />
    </Section>
  )
}

