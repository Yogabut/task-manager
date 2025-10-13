import React, { useRef, useEffect } from 'react';
import FullCalendar, { EventInput } from '@fullcalendar/react';
// FullCalendar styles (ensure packages installed with npm install)
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

type Props = {
    events: EventInput[];
    initialDate?: Date;
};

const FullCalendarView: React.FC<Props> = ({ events, initialDate }) => {
    const ref = useRef<FullCalendar | null>(null);

    useEffect(() => {
        // you can access FullCalendar API via ref.current.getApi()
    }, []);

    return (
        <div className="bg-card rounded-2xl p-4">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            initialDate={initialDate}
            nowIndicator={true}
            editable={false}
            selectable={true}
            height="auto"
        />
        </div>
    );
};

export default FullCalendarView;
