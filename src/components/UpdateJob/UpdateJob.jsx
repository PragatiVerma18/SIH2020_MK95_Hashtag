import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { getJob, updateJob } from 'api';
import { getDomains, getQualifications } from 'utils';

import { StyledForm } from 'components/StyledForm';

function UpdateJob({ user }) {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    user: '',
    title: '',
    description: '',
    location: '',
    type: 'Full-Time',
    category: '',
    last_date: '',
    company_name: '',
    vacancies: '',
    doc_url: '',
    salary: '',
    tags: 'Medical',
    website: '',
    age_limit: '',
    qualification: 'Intermediate (10+2)',
    experience: '',
    job_for_women: false,
    job_for_disabled: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    const dataObj = {
      ...jobDetails,
      user: user.username,
      company_name: user.username,
    };
    await updateJob(id, dataObj);
    history.push('/dashboard');
    setPending(false);
  };

  const handleCheckboxChange = ({ target: { name } }) =>
    setJobDetails((state) => ({ ...state, [name]: !jobDetails[name] }));

  const handleJobDetailsChange = ({ target: { name, value } }) =>
    setJobDetails((state) => ({ ...state, [name]: value }));

  const fetchJobDetails = useCallback(async () => {
    const job = await getJob(id);
    setJobDetails(job);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (user.role === 'Employee')
    return (
      <div className="text-red-600 text-3xl font-bold m-auto">
        Please login as a Government organization to create a new Job.
      </div>
    );

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledForm className="update-job">
      <h1>Update Job Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="mt-1 flex flex-col sm:flex-row">
          <div>
            <label>Job Title</label>
            <input
              type="text"
              placeholder="Eg: Civil Enginneer"
              name="title"
              value={jobDetails.title}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div className="sm:ml-2">
            <label>Job Location</label>
            <input
              type="text"
              placeholder="Eg: Delhi"
              name="location"
              value={jobDetails.location}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
        <div className="mt-2">
          <div>
            <label>Job type</label>
            <select
              className="sm:w-full"
              name="type"
              onChange={(e) => handleJobDetailsChange(e)}
              value={jobDetails.type}>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
            </select>
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row">
          <label className="cursor-pointer flex text-gray-500 font-bold">
            <input
              type="checkbox"
              name="job_for_women"
              checked={jobDetails.job_for_women}
              onChange={handleCheckboxChange}
              style={{ width: 'fit-content' }}
            />
            <span>Jobs for Women</span>
          </label>
          <label className="cursor-pointer flex text-gray-500 font-bold">
            <input
              type="checkbox"
              name="job_for_disabled"
              checked={jobDetails.job_for_disabled}
              onChange={handleCheckboxChange}
              style={{ width: 'fit-content' }}
            />
            <span>Jobs for Disabled people</span>
          </label>
        </div>
        <div className="mt-2">
          <div>
            <label>Job Description</label>
            <textarea
              type="text"
              placeholder="Please Describe the job here"
              name="summary"
              className="h-24 w-full"
              value={jobDetails.summary}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row">
          <div>
            <label>Job Category</label>
            <input
              type="text"
              placeholder="Eg: CS/IT"
              name="category"
              value={jobDetails.category}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div className="sm:ml-2">
            <label>Number of Vacancies</label>
            <input
              type="number"
              placeholder="Eg: 10"
              name="vacancies"
              value={jobDetails.vacancies}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row">
          <div>
            <label>Website</label>
            <input
              type="text"
              placeholder="Eg: https://abc.com"
              name="website"
              value={jobDetails.website}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div className="sm:ml-2">
            <label>Age Limit</label>
            <input
              type="text"
              placeholder="Eg: age >18"
              name="age_limit"
              value={jobDetails.age_limit}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row">
          <div>
            <label>Min. Qualification</label>
            <select
              name="qualification"
              value={jobDetails.qualification}
              onChange={handleJobDetailsChange}
              className="qual">
              {getQualifications().map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>
          <div className="sm:ml-2">
            <label>Min. Experience</label>
            <input
              type="number"
              placeholder="Eg: 2"
              name="experience"
              value={jobDetails.experience}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col sm:flex-row">
          <div>
            <label>Salary</label>
            <input
              type="number"
              placeholder="Eg: 100000"
              name="salary"
              value={jobDetails.salary}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div className="sm:ml-2">
            <label>Last date to apply</label>
            <input
              type="datetime-local"
              name="last_date"
              value={jobDetails.last_date}
              onChange={handleJobDetailsChange}
              className="last_date"
            />
          </div>
        </div>
        <div className="mt-2">
          <div>
            <label>Tags</label>
            <select
              className="sm:w-full"
              name="tags"
              onChange={handleJobDetailsChange}
              value={jobDetails.tags}>
              {getDomains().map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="mt-1" type="submit" disabled={pending}>
          {!pending ? 'Update Job' : 'Updating Job...'}
        </button>
      </form>
    </StyledForm>
  );
}

export default UpdateJob;
