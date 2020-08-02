import React, { useState, useEffect, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { getProfile, getAllJobs } from 'api';

import { StyledContainer } from 'components/StyledContainer';

function RecommendedJobs({ user }) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const filterJobs = (profile, jobs) => {
    let allJobs = jobs;
    if (profile.gender === 'Female')
      allJobs = allJobs.filter((j) => j.job_for_women);
    else allJobs = allJobs.filter((j) => !j.job_for_women);
    allJobs = allJobs.filter((j) => j.category === profile.industry);
    allJobs = allJobs.filter(
      (j) =>
        Math.floor((new Date() - new Date(profile.dob)) / 31536000000) >=
        parseInt(j.age_limit.match(/\d+/)[0]),
    );
    setJobs(allJobs);
    setLoading(false);
  };

  const fetchUserData = useCallback(async () => {
    if (user.username) {
      const { username } = user;
      const profile = await getProfile(username, 'Employee');
      const jobs = await getAllJobs();
      filterJobs(profile, jobs);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <>
      {jobs.length ? (
        <StyledContainer className="p-8">
          <div className="cards-grid">
            <div>
              <div className="grid-card">
                <h1>Recommended Jobs</h1>
                <p className="mb-2 font-bold text-gray-800 text-sm">
                  Total Results: {jobs.length}
                </p>

                {jobs.map((job) => (
                  <Link key={job.id} to={`/job/${job.id}`}>
                    <div
                      className={`${
                        job.job_for_women || job.job_for_disabled
                          ? job.job_for_women
                            ? 'job women-job'
                            : 'job disabled-job'
                          : 'job'
                      }`}>
                      <p className="job-main">
                        <span className="title">{job.title}</span>
                        <span> ({job.type})</span>, <span>{job.location}</span>{' '}
                        -{' '}
                        <Link
                          to={`org/${job.company_name}`}
                          className="uppercase text-blue-600 hover:underline">
                          {job.company_name}
                        </Link>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-bold">Salary: </span>
                        {job.salary} (per month)
                      </p>
                      <p className="text-gray-700">
                        <span className="font-bold">Vacancies: </span>
                        {job.vacancies}
                      </p>
                      <p className="job-desc sm:w-3/4">
                        {job.summary.length > 160
                          ? `${job.summary.substring(0, 160)}...`
                          : job.summary}
                      </p>
                      <div className="flex justify-between sm:flex-wrap">
                        <p className="text-blue-600 hover:underline">
                          Read more...
                        </p>
                        <p className="text-gray-700">
                          Posted on{' '}
                          {new Date(
                            job.updated_at.slice(0, 10),
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {user.role === 'Employee' && (
                        <button className="apply-button relative sm:absolute">
                          Apply Now
                        </button>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </StyledContainer>
      ) : (
        <h1 className="text-3xl font-bold text-center m-2 text-blue-700 m-auto">
          No Job recommendations found!
        </h1>
      )}
    </>
  );
}

export default RecommendedJobs;
