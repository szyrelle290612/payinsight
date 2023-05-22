import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Students Data',
        },
    },
};

const labels = ['week1', 'week2', 'week3', 'week4'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Activity Summary',
            data: [1, 2, 3, 4, 5, 7],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
};

export function LineChart() {
    return <Line options={options} data={data} />;
}
