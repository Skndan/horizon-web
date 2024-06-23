import { format, parseISO } from "date-fns";

export function timeObjectToString(timeObj: any) {
    // Assuming the input timeObj is like { hour: 5, minute: 5, second: 0, millisecond: 0 }
    // Convert each part of the time into a string, ensuring two digits for hours, minutes, and seconds,
    // and proper formatting for milliseconds.
    const hours = timeObj.hour.toString().padStart(2, '0');
    const minutes = timeObj.minute.toString().padStart(2, '0');
    const seconds = timeObj.second.toString().padStart(2, '0');
    // Format milliseconds, assuming you want to expand them to a longer format
    // Here I'm just repeating the milliseconds value to illustrate, but you might adjust based on your needs
    const milliseconds = (timeObj.millisecond.toString() + '000000').slice(0, 9);

    // Combine them into the final string
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function dateObjectToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

export function stringToTimeObject(timeStr?: string) {

    if(!timeStr){
        return {};
    }
    // Assuming the input timeStr is like "13:45:30.123456789"
    // Split the string into components
    const [timePart, millisecondPart] = timeStr.split('.');
    const [hour, minute, second] = timePart.split(':').map(Number); // Convert strings to numbers
    // const millisecond = parseInt(millisecondPart.slice(0, 3), 10); // Get only the first 3 digits for milliseconds
    const millisecond = 0; // Get only the first 3 digits for milliseconds

    // Construct the time object
    return { hour, minute, second, millisecond };
}

export function formatDate(dateString: string, formatStr: string) {
    const date = parseISO(dateString); // Converts ISO string to Date object
    return format(date, formatStr); // Formats the date
}

export function formatTime(timeStr: string, format = 'HH:mm:ss') {
    // Split the time string into parts
    const [hoursPart, minutesPart, secondsPart] = timeStr.split(':').map(num => parseInt(num, 10));

    // Apply 12-hour format if needed
    const isPM = hoursPart >= 12;
    let hours = hoursPart;
    if (/hh|hh12/.test(format) && hours > 12) hours -= 12;
    if (/hh|hh12/.test(format) && hours === 0) hours = 12;  // Adjust midnight to 12 for 12-hour format

    // Padding hours, minutes, and seconds to ensure two digits
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutesPart).padStart(2, '0');
    const paddedSeconds = String(secondsPart).padStart(2, '0');

    // Replacing format tokens with actual time values
    return format
        .replace('HH', String(hoursPart).padStart(2, '0'))  // 24-hour format
        .replace('hh', paddedHours)  // 12-hour format
        .replace('mm', paddedMinutes)  // Minutes
        .replace('ss', paddedSeconds)  // Seconds
        .replace('A', isPM ? 'PM' : 'AM')  // AM/PM
        .replace('a', isPM ? 'pm' : 'am');  // am/pm
}

export function isWeekend(dateStr: string) {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Returns true if it's Sunday (0) or Saturday (6)
}
