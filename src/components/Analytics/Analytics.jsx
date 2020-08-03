import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';

import { getNumberOfJobs, getAvgVacancyTime } from 'api';

import { StyledContainer } from 'components/StyledContainer';

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [jobStats, setJobStats] = useState([]);
  const [vacancyStats, setVacancyStats] = useState([]);

  const fetchJobStats = useCallback(async () => {
    const data = await getNumberOfJobs();
    setJobStats(data);
  }, [setJobStats]);

  const fetchVacancyStats = useCallback(async () => {
    const data = await getAvgVacancyTime();
    setVacancyStats(data);
  }, [setVacancyStats]);

  const fetchStats = useCallback(async () => {
    await fetchJobStats();
    await fetchVacancyStats();
    setLoading(false);
  }, [fetchJobStats, fetchVacancyStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  const jobData = {
    labels: Object.keys(jobStats),
    datasets: [
      {
        label: 'Number of Jobs',
        backgroundColor: 'rgba(59,123,191,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: Object.values(jobStats),
      },
    ],
  };

  const vacancyData = {
    labels: Object.keys(vacancyStats),
    datasets: [
      {
        label: 'Average time of fill a vacancy',
        backgroundColor: 'rgba(59,123,191,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: Object.values(vacancyStats),
      },
    ],
  };
  return (
    <StyledContainer>
      <h1>Job Analytics</h1>
      <Bar
        data={jobData}
        options={{
          title: {
            display: true,
            text: 'Number of Jobs',
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
      <Bar
        className="m-auto"
        data={vacancyData}
        options={{
          title: {
            display: true,
            text: 'Average time of fill a vacancy',
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right',
          },
        }}
      />
    </StyledContainer>
  );
}

export default Analytics;
