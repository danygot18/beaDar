import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import SurveyForm from '../Question/Survey'; // Import the AnswerForm component
import { Box, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';





const chartSetting = {
  width: 500,
  height: 300,
};

const SurveyAnalysis = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);


  useEffect(() => {
    const fetchSurveyAnswers = async () => {
      try {
        // Fetch submitted answers from the survey
        const response = await axios.get('/api/v1/answer');
        const { answers } = response.data;

        // Process the answers to format them for charts
        const lineChartDataMap = new Map();


        answers.forEach(answer => {
          answer.answers.forEach(individualAnswer => {
            const { questions, selectedOption } = individualAnswer;

            // Convert question IDs to labels and filter out unwanted questions
            const questionLabel = mapQuestionIdToLabel(questions);
            if (!questionLabel) return;

            // For LineChart
            const lineData = lineChartDataMap.get(questionLabel) || { questionId: questionLabel, Never: 0, Rarely: 0, Always: 0 };
            lineData[selectedOption]++;
            lineChartDataMap.set(questionLabel, lineData);

            // For BarChart
            

            // Validate and handle NaN values
            
          });
        });

        const newLineChartData = Array.from(lineChartDataMap.values());

        console.log('Line Chart Data:', newLineChartData);

        setLineChartData(newLineChartData);
        setLoading(false); // Set loading state to false after data fetching
      } catch (error) {
        console.error('Error fetching survey answers:', error);
        setError('Error fetching survey answers. Please try again later.');
        setLoading(false); // Set loading state to false in case of error
      }
    };


    const mapQuestionIdToLabel = (questionId) => {
      switch (questionId) {
        case "65e71493547f2b087c3c4a45":
          return "Q1";
        case "65e72d31547f2b087c3c4b66":
          return "Q2";
        case "65e72fd4547f2b087c3c4bac":
          return "Q3";
        case "65e7554042fc18a100b563d1":
            return "Q4";
       
        default:
          return null;
      }
    };

    fetchSurveyAnswers();
  }, []);

  


  const handleConvertToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Flatten barChartData array
    const flattenedBarChartData = barChartData.map(data => {
      return {
        questionId: data.questionId,
        Not_effective: data.Not_effective,
        Effective: data.Effective,
        Very_Effective: data.Very_Effective
      };
    });

    // Filter lineChartData to exclude Q6 to Q15
    const filteredLineChartData = lineChartData.filter(data => {
      const questionNumber = parseInt(data.questionId.substr(1)); // Extract the question number
      return questionNumber <= 5; // Include questions 1 to 5
    });

    // Convert filteredLineChartData to Excel format
    const lineDataWS = XLSX.utils.json_to_sheet(filteredLineChartData);
    XLSX.utils.book_append_sheet(wb, lineDataWS, 'Line Chart Data');

    // Convert flattenedBarChartData to Excel format
    const barDataWS = XLSX.utils.json_to_sheet(flattenedBarChartData);
    XLSX.utils.book_append_sheet(wb, barDataWS, 'Bar Chart Data');

    // Save the workbook as an Excel file
    const excelFileName = 'analytics.xlsx';
    XLSX.writeFile(wb, excelFileName);
  };



  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  // Filter lineChartData to exclude Q6 to Q10
  const fLineChartData = lineChartData.filter(data => !data.questionId.startsWith('Q6') && !data.questionId.startsWith('Q7') && !data.questionId.startsWith('Q8') && !data.questionId.startsWith('Q9') && !data.questionId.startsWith('Q10') && !data.questionId.startsWith('Q11') && !data.questionId.startsWith('Q12') && !data.questionId.startsWith('Q13') && !data.questionId.startsWith('Q14') && !data.questionId.startsWith('Q15'));


  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, p: 3 }} style={{ background: 'white' }}>

      {/* Sidebar and Analytics */}
      <Box sx={{ gridColumn: 'span 2' }}>
        <Sidebar />
      </Box>

      <Box sx={{ gridColumn: 'span 5' }}>
        <Box ref={chartContainerRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Analytics
          </Typography>

          {/* Line Chart */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Box ref={chartContainerRef} sx={{ borderRadius: '10px', marginBottom: '20px', padding: '20px' }} className="card product-cart-text prodcard-JSON">
            <Typography variant="h5" gutterBottom>
              Rate 1 to 3
            </Typography>
            <LineChart
              dataset={fLineChartData}
              xAxis={[{ scaleType: 'band', dataKey: 'questionId' }]}
              series={[
                { dataKey: '1', label: '1' },
                { dataKey: '2', label: '2' },
                { dataKey: '3', label: '3' }
              ]}
              {...chartSetting}
              ref={chartRef}
            />
          </Box>
          </div>

          {/* Bar Chart */}
          

        

          
        </Box>
      </Box>

      <Box sx={{ gridColumn: 'span 5'}}>
        <SurveyForm />
      </Box>
    </Box>
  );
}

export default SurveyAnalysis;