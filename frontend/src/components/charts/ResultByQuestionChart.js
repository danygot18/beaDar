import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from 'chart.js/auto';
import { Button, Box, FormGroup, InputLabel, FormControl, Grid, Select, MenuItem, Paper, Stack, TextField, Typography, OutlinedInput } from "@mui/material";


const chartTypes = [
    { value: "bar", label: "Bar" },
    { value: "pie", label: "Pie" },
    { value: "doughnut", label: "Doughnut" },
    { value: "polarArea", label: "PolarChart" },
    { value: "line", label: "lineChart" },
]

const ResultByQuestionChart = () => {

    const [farmerQuestions, setFarmerQuestions] = useState([]);
    const [selectedQuestionId, setSeletedQuestionId] = useState('');
    const [selectedChartType, setSelectedChartType] = useState('bar')

    const [data, setData] = useState({});

    const getAllQuestions = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/v1/fquestions`);
        setFarmerQuestions(data.questions);
    }

    const getResults = async (id) => {
        if (id === '') {
            return alert('Huh?')
        }
        setSeletedQuestionId(id)
        const { data } = await axios.get(`http://localhost:5000/api/v1/get-results-by-question/${id}`);
        setData(data.answers);
    }

    useEffect(() => {
        getAllQuestions();
    }, [])


    useEffect(() => {
        const ctx = document.getElementById('allCharts').getContext('2d');

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: selectedChartType,
            data: {
                labels: Object.keys(data),
                datasets: [
                    {
                        label: 'Results',
                        data: Object.values(data),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 205, 86)',
                            'rgb(201, 203, 207)',
                            'rgb(54, 162, 235)'
                        ],
                        borderWidth: 3,
                        borderColor: "black",
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [data, selectedChartType]);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="selectedQuestionId">Select Question</InputLabel>
                    <Select
                        onChange={(e) => getResults(e.target.value)}
                        fullWidth
                        required
                        id='selectedQuestionId'
                        labelId="selectedQuestionId"
                        name='selectedQuestionId'
                        input={<OutlinedInput label="Select Question" />}
                        value={selectedQuestionId}
                    >
                        <MenuItem selected={true} value=''>
                            Select Question
                        </MenuItem>
                        {farmerQuestions.map((question, i) => (
                            <MenuItem key={i} value={question._id}>
                                {question.questionText}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 600 }}>
                    <InputLabel id="selectedChartType">Chart Type</InputLabel>
                    <Select
                        fullWidth
                        required
                        id='selectedChartType'
                        labelId="selectedChartType"
                        name='selectedChartType'
                        input={<OutlinedInput label="Chart Type" />}
                        value={selectedChartType}
                        onChange={e => {
                            if (e.target.value === '') {
                                return alert('huh')
                            }
                            setSelectedChartType(e.target.value)
                        }}
                    >
                        <MenuItem selected={true} value=''>
                            Select Chart Type
                        </MenuItem>
                        {chartTypes.map((type, i) => (
                            <MenuItem sx={{ textTransform: 'capitalize' }} key={i} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '600px' }}>
                    <canvas id="allCharts" />
                </Box>
            </Box>
        </div>
    )
}

export default ResultByQuestionChart