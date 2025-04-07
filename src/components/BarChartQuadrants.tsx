import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useLandmarks } from "../contexts/LandmarkContext";

const BarChartQuadrants: React.FC = () => {
    const { landmarks } = useLandmarks();

    const quadrantCounts = landmarks.reduce(
        (acc, landmark) => {
            if (landmark.lat >= 0 && landmark.lng >= 0) acc[0]++;
            else if (landmark.lat >= 0 && landmark.lng < 0) acc[1]++;
            else if (landmark.lat < 0 && landmark.lng < 0) acc[2]++;
            else if (landmark.lat < 0 && landmark.lng >= 0) acc[3]++;
            return acc;
        },
        [0, 0, 0, 0]
    );

    const data = [
        { quadrant: "NE", count: quadrantCounts[0] },
        { quadrant: "NW", count: quadrantCounts[1] },
        { quadrant: "SW", count: quadrantCounts[2] },
        { quadrant: "SE", count: quadrantCounts[3] },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="quadrant" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartQuadrants;
