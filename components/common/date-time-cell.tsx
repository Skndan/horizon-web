const DateTimeCell = ({ dateStr }: { dateStr: string }) => {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);

    return <div>{formattedDate}</div>;
};

export default DateTimeCell;