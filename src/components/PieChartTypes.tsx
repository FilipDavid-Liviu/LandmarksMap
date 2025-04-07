import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useLandmarks } from "../contexts/LandmarkContext";

const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4CAF50",
    "#9966FF",
    "#FF9900",
];

const PieChartTypes: React.FC = () => {
    const { landmarks } = useLandmarks();

    const typeCounts = landmarks.reduce<Record<string, number>>(
        (acc, landmark) => {
            acc[landmark.type] = (acc[landmark.type] || 0) + 1;
            return acc;
        },
        {}
    );

    const pieData = Object.entries(typeCounts).map(([type, count], index) => ({
        name: type,
        value: count,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
            >
                {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default PieChartTypes;
