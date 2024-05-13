
interface DateTimeCellProps {
    dateStr: string;
    isTime: number;
}

const DateTimeCell = ({ dateStr, isTime }: DateTimeCellProps) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    let formattedDate = "";

    switch (isTime) {
        case 0:
            formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
            break;
        case 1:
            formattedDate = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
            break;
        case 3:
            const dd = new Date();
            const [hours, minutes, seconds] = dateStr.split(':');
            dd.setHours(parseInt(hours, 10)); // Set hours
            dd.setMinutes(parseInt(minutes, 10)); // Set minutes
            dd.setSeconds(parseInt(seconds, 10)); // Set seconds
            formattedDate = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(dd);
            break;
        default:
            formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);

    }
    return <div>{formattedDate}</div>;
};

export default DateTimeCell;
