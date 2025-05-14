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

export const normalize = (text: string) => {
    return text.toLowerCase().replace(/[\s.\-']/g, "");
};

export const isMatch = (landmark: any, search: string) => {
    const query = normalize(search);
    const nameType = normalize(landmark.name + landmark.type);
    const typeName = normalize(landmark.type + landmark.name);
    return nameType.includes(query) || typeName.includes(query);
};

export const isMatchName = (landmark: any, search: string) => {
    const query = normalize(search);
    const name = normalize(landmark.name);
    return name.includes(query);
};

export const sortByLatitude = (landmarks: any) => {
    return landmarks.slice().sort((a: any, b: any) => b.lat - a.lat);
};

export const sortByDistanceToEquator = (landmarks: any) => {
    return landmarks
        .slice()
        .sort((a: any, b: any) => Math.abs(b.lat) - Math.abs(a.lat));
};

export const authFetch = async (
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> => {
    const token = localStorage.getItem("token");

    const authHeaders: Record<string, string> = {
        ...(init.headers as Record<string, string>), // cast safely
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchInit: RequestInit = {
        ...init,
        headers: authHeaders,
    };

    return fetch(input, fetchInit);
};
