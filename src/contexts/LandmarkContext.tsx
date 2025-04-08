import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";

const API_URL = "http://localhost:8000";

interface Landmark {
    id: number;
    lat: number;
    lng: number;
    name: string;
    type: string;
    description: string;
}
const LandmarkContext = createContext<{
    landmarks: Landmark[];
    addLandmark: (landmark: Landmark) => void;
    removeLandmark: (id: number) => void;
    updateLandmark: (landmark: Landmark) => void;
    fetchFilteredSortedLandmarks: (
        search: string,
        sort: number
    ) => Promise<void>;
    isServerUp: boolean;
}>({
    landmarks: [],
    addLandmark: () => {},
    removeLandmark: () => {},
    updateLandmark: () => {},
    fetchFilteredSortedLandmarks: async () => {},
    isServerUp: false,
});

export const LandmarkProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isServerUp, setIsServerUp] = useState(false);
    const wasServerUpRef = useRef(false);
    const hasLoadedOfflineLandmarks = useRef(false);
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    useEffect(() => {
        const stored = localStorage.getItem("offlineQueue");
        console.log("Server is down, loading offline landmarks...");
        if (stored) {
            const operations = JSON.parse(stored);
            console.log("Server is down, loading offline landmarks...2");
            const addedLandmarks = operations
                .filter((op: Operation) => op.type === "add")
                .map((op: any) => op.landmark);
            console.log(addedLandmarks);
            setLandmarks(addedLandmarks);
        }
        hasLoadedOfflineLandmarks.current = true;
    }, []);

    const checkServer = async () => {
        try {
            const res = await fetch(`${API_URL}/health`);
            const serverIsUp = res.ok;
            if (!wasServerUpRef.current && serverIsUp) {
                console.log("Server is up, fetching landmarks...");
                const data = await fetch(`${API_URL}/get_all`);
                const landmarks = await data.json();
                setLandmarks(landmarks);
            }
            wasServerUpRef.current = serverIsUp;
            setIsServerUp(serverIsUp);
        } catch (err) {
            wasServerUpRef.current = false;
            setIsServerUp(false);
        }
    };

    useEffect(() => {
        console.log(localStorage.getItem("offlineLandmarks"));
        checkServer();
        const interval = setInterval(checkServer, 10000);
        return () => clearInterval(interval);
    }, []);

    type Operation =
        | { type: "add"; landmark: Landmark }
        | { type: "delete"; id: number }
        | { type: "update"; landmark: Landmark };

    const enqueueOperation = (op: Operation) => {
        let queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
        if (op.type === "delete") {
            const existingAdd = queue.find(
                (queuedOp: Operation) =>
                    queuedOp.type === "add" && queuedOp.landmark.id === op.id
            );

            if (existingAdd) {
                queue = queue.filter(
                    (queuedOp: Operation) => queuedOp !== existingAdd
                );
            } else {
                queue.push(op);
            }
        } else if (op.type === "update") {
            const existingAdd = queue.find(
                (q: Operation) =>
                    q.type === "add" && q.landmark.id === op.landmark.id
            );
            if (existingAdd) {
                existingAdd.landmark = op.landmark;
            } else {
                queue = queue.filter(
                    (q: Operation) =>
                        !(
                            q.type === "update" &&
                            q.landmark.id === op.landmark.id
                        )
                );
                queue.push(op);
            }
        } else if (op.type === "add") {
            queue.push(op);
        }
        localStorage.setItem("offlineQueue", JSON.stringify(queue));
    };
    const handleOfflineOperation = (op: Operation) => {
        setIsServerUp(false);

        enqueueOperation(op);
    };

    useEffect(() => {
        if (!isServerUp) {
            return;
        }

        const sync = async () => {
            const queue: Operation[] = JSON.parse(
                localStorage.getItem("offlineQueue") || "[]"
            );

            for (const op of queue) {
                if (op.type === "add") {
                    addLandmark(op.landmark);
                } else if (op.type === "delete") {
                    removeLandmark(op.id);
                } else if (op.type === "update") {
                    updateLandmark(op.landmark);
                }
            }

            localStorage.removeItem("offlineQueue");
        };

        sync();
    }, [isServerUp]);

    const addLandmark = async (landmark: Landmark) => {
        if (!isServerUp) {
            enqueueOperation({ type: "add", landmark });
            setLandmarks((prev) => [...prev, landmark]);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(landmark),
            });

            if (!res.ok) throw new Error("Failed to add landmark");

            const newLandmark: Landmark = await res.json();
            setLandmarks((prev) => [...prev, newLandmark]);
        } catch (err) {
            console.error(err);
            const op: Operation = {
                type: "add",
                landmark: landmark,
            };
            setLandmarks((prev) => [...prev, landmark]);
            handleOfflineOperation(op);
        }
    };

    const removeLandmark = async (id: number) => {
        if (!isServerUp) {
            enqueueOperation({ type: "delete", id });
            setLandmarks((prev) => prev.filter((l) => l.id !== id));
            return;
        }

        try {
            const res = await fetch(`${API_URL}/delete/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete landmark");

            setLandmarks((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            console.error(err);
            if (id >= 1) {
                const op: Operation = {
                    type: "delete",
                    id: id,
                };
                setLandmarks((prev) => prev.filter((l) => l.id !== id));
                handleOfflineOperation(op);
            }
        }
    };

    const updateLandmark = async (landmark: Landmark) => {
        if (!isServerUp) {
            enqueueOperation({ type: "update", landmark });
            setLandmarks((prev) =>
                prev.map((l) => (l.id === landmark.id ? landmark : l))
            );
            return;
        }
        try {
            const res = await fetch(`${API_URL}/update/${landmark.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lat: landmark.lat,
                    lng: landmark.lng,
                    name: landmark.name,
                    type: landmark.type,
                    description: landmark.description,
                }),
            });

            if (!res.ok) throw new Error("Failed to update landmark");

            const updated: Landmark = await res.json();
            setLandmarks((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
            );
        } catch (err) {
            console.error(err);
            if (landmark.id >= 1) {
                const op: Operation = {
                    type: "update",
                    landmark: landmark,
                };
                setLandmarks((prev) =>
                    prev.map((l) => (l.id === landmark.id ? landmark : l))
                );
                handleOfflineOperation(op);
            }
        }
    };

    const fetchFilteredSortedLandmarks = async (
        search: string,
        sort: number
    ): Promise<void> => {
        if (!isServerUp) {
            const filteredLandmarks = getSearchQueryWithSorting(search, sort);
            setLandmarks(filteredLandmarks);
            return;
        }
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sort !== 0) params.append("sort", sort.toString());

        try {
            const res = await fetch(`${API_URL}/get_all?${params.toString()}`);
            const data = await res.json();
            setLandmarks(data);
        } catch (err) {
            console.error(err);
            setIsServerUp(false);
            const filteredLandmarks = getSearchQueryWithSorting(search, sort);
            setLandmarks(filteredLandmarks);
        }
    };

    const getSearchQueryWithSorting = (
        search: string,
        sort: number
    ): Landmark[] => {
        const filteredLandmarks = landmarks.filter((landmark) =>
            isMatch(landmark, search)
        );
        if (sort === 1) {
            return sortByLatitude(filteredLandmarks);
        } else if (sort === 2) {
            return sortByDistanceToEquator(filteredLandmarks);
        } else {
            return filteredLandmarks;
        }
    };

    const isMatch = (landmark: any, search: string) => {
        const query = search.toLowerCase();
        const nameType = (landmark.name + " " + landmark.type).toLowerCase();
        const typeName = (landmark.type + " " + landmark.name).toLowerCase();
        return nameType.includes(query) || typeName.includes(query);
    };
    const sortByLatitude = (landmarks: any) => {
        return landmarks.slice().sort((a: any, b: any) => b.lat - a.lat);
    };
    const sortByDistanceToEquator = (landmarks: any) => {
        return landmarks
            .slice()
            .sort((a: any, b: any) => Math.abs(b.lat) - Math.abs(a.lat));
    };

    return (
        <LandmarkContext.Provider
            value={{
                landmarks,
                addLandmark,
                removeLandmark,
                updateLandmark,
                fetchFilteredSortedLandmarks,
                isServerUp,
            }}
        >
            {children}
        </LandmarkContext.Provider>
    );
};

export const useLandmarks = () => useContext(LandmarkContext);
