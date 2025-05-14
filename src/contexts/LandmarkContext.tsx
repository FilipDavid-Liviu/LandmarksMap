import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";
import {
    isMatch,
    isMatchName,
    sortByDistanceToEquator,
    sortByLatitude,
    authFetch,
} from "../components/Utils";
const API_URL = "http://localhost:8000";

export interface Landmark {
    id: number;
    lat: number;
    lng: number;
    name: string;
    type: string;
    description: string;
    image?: string | File;
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
    fetchSearchedLandmarks: (search: string, limit?: number) => Promise<void>;
    searched: Landmark[];
    saveLandmark: (id: number) => Promise<void>;
    unsaveLandmark: (id: number) => Promise<void>;
    savedLandmarkIds: number[];
    fetchSavedLandmarks: () => Promise<void>;
    setSavedLandmarkIds: React.Dispatch<React.SetStateAction<number[]>>;
    fetchMonitoredUsers: () => Promise<void>;
    monitoredUsers: any[];
}>({
    landmarks: [],
    addLandmark: () => {},
    removeLandmark: () => {},
    updateLandmark: () => {},
    fetchFilteredSortedLandmarks: async () => {},
    isServerUp: false,
    fetchSearchedLandmarks: async () => {},
    searched: [],
    saveLandmark: async () => {},
    unsaveLandmark: async () => {},
    savedLandmarkIds: [],
    fetchSavedLandmarks: async () => {},
    setSavedLandmarkIds: () => {},
    fetchMonitoredUsers: async () => {},
    monitoredUsers: [],
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
                const data = await fetch(`${API_URL}/get_landmarks/get_all`);
                const landmarks = await data.json();
                setLandmarks(landmarks);
                console.log(landmarks);
                fetchSavedLandmarks();
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
        const interval = setInterval(checkServer, 5000);
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
    // const handleOfflineOperation = (op: Operation) => {
    //     setIsServerUp(false);

    //     enqueueOperation(op);
    // };

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
            const offlineLandmark = { ...landmark };
            if (offlineLandmark.image instanceof File) {
                delete offlineLandmark.image;
            }
            enqueueOperation({ type: "add", landmark: offlineLandmark });
            setLandmarks((prev) => [...prev, offlineLandmark]);
            return;
        }

        try {
            const res = await authFetch(`${API_URL}/landmarks/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lat: landmark.lat,
                    lng: landmark.lng,
                    name: landmark.name,
                    type: landmark.type,
                    description: landmark.description,
                }),
            });

            if (!res.ok) throw new Error("Failed to add landmark");

            const newLandmark: Landmark = await res.json();
            if (landmark.image instanceof File) {
                const formData = new FormData();
                formData.append("file", landmark.image);

                const photoRes = await authFetch(
                    `${API_URL}/photos/upload/${newLandmark.id}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (photoRes.ok) {
                    const { image } = await photoRes.json();
                    newLandmark.image = image;
                } else {
                    throw new Error("Failed to upload image");
                }
            }
            setLandmarks((prev) => [...prev, newLandmark]);
        } catch (err) {
            console.error(err);
            // const op: Operation = {
            //     type: "add",
            //     landmark: landmark,
            // };
            // setLandmarks((prev) => [...prev, landmark]);
            // handleOfflineOperation(op);
        }
    };

    const removeLandmark = async (id: number) => {
        if (!isServerUp) {
            enqueueOperation({ type: "delete", id });
            setLandmarks((prev) => prev.filter((l) => l.id !== id));
            return;
        }

        try {
            const res = await authFetch(`${API_URL}/landmarks/delete/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete landmark");

            setLandmarks((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            console.error(err);
            // if (id >= 1) {
            //     const op: Operation = {
            //         type: "delete",
            //         id: id,
            //     };
            //     setLandmarks((prev) => prev.filter((l) => l.id !== id));
            //     handleOfflineOperation(op);
            // }
        }
    };

    const updateLandmark = async (landmark: Landmark) => {
        if (!isServerUp) {
            const offlineLandmark = { ...landmark };
            if (offlineLandmark.image instanceof File) {
                delete offlineLandmark.image;
            }
            enqueueOperation({ type: "update", landmark: offlineLandmark });
            setLandmarks((prev) =>
                prev.map((l) => (l.id === landmark.id ? offlineLandmark : l))
            );
            return;
        }
        try {
            const res = await authFetch(
                `${API_URL}/landmarks/update/${landmark.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lat: landmark.lat,
                        lng: landmark.lng,
                        name: landmark.name,
                        type: landmark.type,
                        description: landmark.description,
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to update landmark");

            const updated: Landmark = await res.json();

            if (landmark.image instanceof File) {
                const formData = new FormData();
                formData.append("file", landmark.image);

                const photoRes = await authFetch(
                    `${API_URL}/photos/upload/${updated.id}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (photoRes.ok) {
                    const { image } = await photoRes.json();
                    updated.image = image;
                } else {
                    throw new Error("Failed to upload image");
                }
            } else if (typeof landmark.image === "string") {
                updated.image = landmark.image;
            } else if (landmark.image === undefined) {
                const deleteRes = await authFetch(
                    `${API_URL}/photos/delete/${updated.id}`,
                    {
                        method: "DELETE",
                    }
                );
                if (!deleteRes.ok) {
                    throw new Error("Failed to delete image");
                }
                updated.image = undefined;
            }

            setLandmarks((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
            );
        } catch (err) {
            console.error(err);
            // if (landmark.id >= 1) {
            //     const op: Operation = {
            //         type: "update",
            //         landmark: landmark,
            //     };
            //     setLandmarks((prev) =>
            //         prev.map((l) => (l.id === landmark.id ? landmark : l))
            //     );
            //     handleOfflineOperation(op);
            // }
        }
    };

    const [searched, setSearched] = useState<Landmark[]>([]);

    const fetchFilteredSortedLandmarks = async (
        search: string,
        sort: number
    ): Promise<void> => {
        if (!isServerUp) {
            const filteredLandmarks = getSearchQueryWithSorting(search, sort);
            setSearched(filteredLandmarks);
            return;
        }
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sort !== 0) params.append("sort", sort.toString());

        try {
            const res = await authFetch(
                `${API_URL}/get_landmarks/get_all_name_type_sort?${params.toString()}`
            );
            const data = await res.json();
            setSearched(data);
        } catch (err) {
            console.error(err);
            setIsServerUp(false);
            const filteredLandmarks = getSearchQueryWithSorting(search, sort);
            setSearched(filteredLandmarks);
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

    const fetchSearchedLandmarks = async (
        search: string,
        limit: number = 5
    ): Promise<void> => {
        if (!isServerUp) {
            const filteredLandmarks = getSearch(search).slice(0, limit);
            setSearched(filteredLandmarks);
            return;
        }
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("limit", limit.toString());

        try {
            const res = await authFetch(
                `${API_URL}/get_landmarks/get_all_name?${params.toString()}`
            );
            const data = await res.json();
            setSearched(data);
        } catch (err) {
            console.error(err);
            setIsServerUp(false);
            const filteredLandmarks = getSearch(search).slice(0, limit);
            setSearched(filteredLandmarks);
        }
    };
    const getSearch = (search: string): Landmark[] => {
        const filteredLandmarks = landmarks.filter((landmark) =>
            isMatchName(landmark, search)
        );
        return filteredLandmarks;
    };

    const [savedLandmarkIds, setSavedLandmarkIds] = useState<number[]>([]);

    const fetchSavedLandmarks = async () => {
        try {
            const res = await authFetch(`${API_URL}/saved_landmarks/get_saved`);
            if (!res.ok) throw new Error("Failed to fetch saved landmarks");
            const data = await res.json();
            setSavedLandmarkIds(data.saved_landmarks);
        } catch (err) {
            console.error("Error fetching saved landmarks:", err);
        }
    };

    const saveLandmark = async (id: number) => {
        try {
            const res = await authFetch(
                `${API_URL}/saved_landmarks/save/${id}`,
                {
                    method: "POST",
                }
            );
            if (!res.ok) throw new Error("Failed to save landmark");
            setSavedLandmarkIds((prev) => [...new Set([...prev, id])]);
        } catch (err) {
            console.error("Error saving landmark:", err);
        }
    };

    const unsaveLandmark = async (id: number) => {
        try {
            const res = await authFetch(
                `${API_URL}/saved_landmarks/unsave/${id}`,
                {
                    method: "POST",
                }
            );
            if (!res.ok) throw new Error("Failed to unsave landmark");
            setSavedLandmarkIds((prev) => prev.filter((lid) => lid !== id));
        } catch (err) {
            console.error("Error unsaving landmark:", err);
        }
    };

    const [monitoredUsers, setMonitoredUsers] = useState<any[]>([]);
    const fetchMonitoredUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/admin/monitored-users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch monitored users");
            const data = await res.json();
            setMonitoredUsers(data.monitored_users);
        } catch (err) {
            console.error("Error fetching monitored users:", err);
        }
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
                fetchSearchedLandmarks,
                searched,
                saveLandmark,
                unsaveLandmark,
                savedLandmarkIds,
                fetchSavedLandmarks,
                setSavedLandmarkIds,
                fetchMonitoredUsers,
                monitoredUsers,
            }}
        >
            {children}
        </LandmarkContext.Provider>
    );
};

export const useLandmarks = () => useContext(LandmarkContext);
