import "./App.css";
import Map from "./components/Map.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ButtonBar from "./components/ButtonBar.tsx";
import { AddScreen } from "./pages/AddScreen.tsx";
import { UpdateScreen } from "./pages/UpdateScreen.tsx";
import { ListScreen } from "./pages/ListScreen.tsx";
import { FreeRoamScreen } from "./pages/FreeRoamScreen.tsx";

function App() {
    return (
        <Router>
            <ButtonBar />
            <div className="AppMap">
                <Map />
            </div>
            <Routes>
                <Route path="/" element={<FreeRoamScreen />} />
                <Route path="/add" element={<AddScreen />} />
                <Route path="/update" element={<UpdateScreen />} />
                <Route path="/list" element={<ListScreen />} />
                <Route path="/profile" element={null} />
            </Routes>
        </Router>
    );
}

export default App;
