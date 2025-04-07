import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useLandmarks } from "../contexts/LandmarkContext";

const ScatterChartLandmarks: React.FC = () => {
    const { landmarks } = useLandmarks();

    return (
        <ResponsiveContainer width={400} height={200}>
            <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    dataKey="lng"
                    name="Longitude"
                    unit="°"
                    domain={[-180, 180]}
                />
                <YAxis
                    type="number"
                    dataKey="lat"
                    name="Latitude"
                    unit="°"
                    domain={[-90, 90]}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Landmarks" data={landmarks} fill="#FF5733" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterChartLandmarks;
