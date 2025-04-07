export const decimalToDMS = (deg: number, isLatitude: boolean = true) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

    let direction = "";
    if (isLatitude) {
        direction = deg >= 0 ? "N" : "S";
    } else {
        direction = deg >= 0 ? "E" : "W";
    }
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};
