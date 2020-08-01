import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { getAllJobs } from 'api';
import { getDomains, removeDuplicate, getQualifications } from 'utils';
import { StyledContainer } from 'components/StyledContainer';

function Jobs({ user }) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [category, setCategory] = useState('select an option');
  const [type, setType] = useState('select an option');
  const [location, setLocation] = useState('select an option');
  const [womenJobs, setWomenJobs] = useState(false);
  const [disabledJobs, setDisabledJobs] = useState(false);
  const [verifiedJobs, setVerifiedJobs] = useState(false);
  const [org, setOrg] = useState('select an option');
  const [lastDate, setLastDate] = useState('select an option');
  const [qual, setQual] = useState('select an option');

  const clearFilters = () => {
    setCategory('select an option');
    setType('select an option');
    setLocation('select an option');
    setOrg('select an option');
    setLastDate('select an option');
    setQual('select an option');
    setWomenJobs(false);
    setDisabledJobs(false);
    setFilteredJobs(jobs);
  };

  const applyRestFilters = useCallback(() => {
    let allJobs = [...jobs];
    if (location !== 'select an option')
      allJobs = allJobs.filter((j) => j.location === location);
    if (type !== 'select an option')
      allJobs = allJobs.filter((j) => j.type === type);
    if (category !== 'select an option')
      allJobs = allJobs.filter((j) => j.category === category);
    if (org !== 'select an option')
      allJobs = allJobs.filter((j) => j.company_name.toUpperCase() === org);
    if (lastDate !== 'select an option')
      allJobs = allJobs.filter(
        (j) => j.last_date.substring(0, 10) === lastDate,
      );
    if (qual !== 'select an option')
      allJobs = allJobs.filter(
        (j) => j.qualification.toUpperCase() === qual.toUpperCase(),
      );
    if (womenJobs)
      allJobs = allJobs.filter((j) => j.job_for_women === womenJobs);
    if (disabledJobs)
      allJobs = allJobs.filter((j) => j.job_for_disabled === disabledJobs);
    if (verifiedJobs)
      allJobs = allJobs.filter((j) => j.user.verified === verifiedJobs);
    setFilteredJobs(allJobs);
  }, [
    category,
    disabledJobs,
    jobs,
    lastDate,
    location,
    org,
    qual,
    type,
    verifiedJobs,
    womenJobs,
  ]);

  const handleCheckboxChange = ({ target: { name } }) => {
    if (name === 'job_for_women') setWomenJobs((state) => !state);
    else if (name === 'verifiedJobs') setVerifiedJobs((state) => !state);
    else setDisabledJobs((state) => !state);
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'location') setLocation(value);
    else if (name === 'type') setType(value);
    else if (name === 'org') setOrg(value);
    else if (name === 'lastDate') setLastDate(value);
    else if (name === 'qual') setQual(value);
    else setCategory(value);
  };

  useEffect(() => {
    applyRestFilters();
  }, [location, type, category, womenJobs, disabledJobs, applyRestFilters]);

  const getJobs = useCallback(async () => {
    const allJobs = await getAllJobs();
    setJobs(allJobs);
    setFilteredJobs(allJobs);
    setLoading(false);
  }, [setJobs, setLoading]);

  useEffect(() => {
    getJobs();
  }, [getJobs]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledContainer>
      <div className="cards-grid">
        <div className="left-card">
          <div className="grid-card">
            <p className="text-center text-lg text-blue-600 font-bold">
              Filter Jobs
            </p>
            <div className="mt-3">
              <p className="font-bold text-sm">Category:</p>
              <select value={category} name="category" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                {getDomains().map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Job Type:</p>
              <select value={type} name="type" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Location:</p>
              <select value={location} name="location" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                {removeDuplicate(jobs.map((job) => job.location)).map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Organization:</p>
              <select value={org} name="org" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                {removeDuplicate(jobs.map((job) => job.company_name)).map(
                  (l) => (
                    <option key={l}>{l.toUpperCase()}</option>
                  ),
                )}
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Last date to apply:</p>
              <select value={lastDate} name="lastDate" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                {removeDuplicate(
                  jobs.map((job) => job.last_date.substring(0, 10)),
                ).map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Qualification:</p>
              <select value={qual} name="qual" onChange={handleChange}>
                <option disabled selected>
                  select an option
                </option>
                {getQualifications().map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <p className="font-bold text-sm">Special Categories:</p>
              <label className="block cursor-pointer">
                <input
                  type="checkbox"
                  checked={womenJobs}
                  name="job_for_women"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-1 text-sm">Jobs for Women</span>
              </label>
              <label className="block cursor-pointer">
                <input
                  type="checkbox"
                  checked={disabledJobs}
                  name="job_for_disabled"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-1 text-sm">Jobs for Disabled</span>
              </label>
              <label className="block cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedJobs}
                  name="verifiedJobs"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-1 text-sm">Jobs by Verified Orgs</span>
              </label>
            </div>
            {filteredJobs.length !== jobs.length && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="right-card">
          <div className="grid-card">
            <h1>Available Jobs</h1>
            <p className="mb-2 font-bold text-gray-800 text-sm">
              Total Results: {filteredJobs.length}
            </p>
            {filteredJobs.length ? (
              filteredJobs.map((job) => (
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
                      <span> ({job.type})</span>, <span>{job.location}</span> -{' '}
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
              ))
            ) : (
              <h2 className="text-center mt-2 text-2xl">No Jobs found!</h2>
            )}
          </div>
        </div>
      </div>
    </StyledContainer>
  );
}

export default Jobs;
