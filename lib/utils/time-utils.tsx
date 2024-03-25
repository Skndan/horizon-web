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