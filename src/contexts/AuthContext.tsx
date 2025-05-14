import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";

const API_URL = "http://localhost:8000";

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<string | null>;
    register: (username: string, password: string) => Promise<string | null>;
    logout: () => void;
    user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);
    const { fetchSavedLandmarks, setSavedLandmarkIds } = useLandmarks();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
            setIsAdmin(storedIsAdmin);
        }
    }, []);

    const login = async (
        username: string,
        password: string
    ): Promise<string | null> => {
        const response = await fetch(`${API_URL}/users/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", username);
            localStorage.setItem(
                "isAdmin",
                data.user.is_admin ? "true" : "false"
            );
            setIsAuthenticated(true);
            setUser(username);
            setIsAdmin(data.user.is_admin);
            fetchSavedLandmarks();
            return null;
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData.detail);
            return errorData.detail;
        }
    };

    const register = async (
        username: string,
        password: string
    ): Promise<string | null> => {
        const response = await fetch(`${API_URL}/users/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            console.log("Registration successful");
            return await login(username, password);
        } else {
            const errorData = await response.json();
            console.error("Registration failed:", errorData.detail);
            return errorData.detail;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        setSavedLandmarkIds([]);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            fetch(`${API_URL}/saved_landmarks/get_saved`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (res.ok) {
                        setIsAuthenticated(true);
                        setUser(storedUser);
                        fetchSavedLandmarks();
                    } else {
                        logout();
                    }
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isAdmin, login, register, logout, user }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
