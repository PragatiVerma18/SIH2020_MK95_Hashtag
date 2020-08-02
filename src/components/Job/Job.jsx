import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, useParams, Link, useHistory } from 'react-router-dom';

import { getJob, applyJob, getProfile } from 'api';

function Job({ user }) {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  const applyToJob = async () => {
    if (profile) {
      setPending(true);
      await applyJob({ employee: user.username, job: id });
      setPending(false);
      history.push('/dashboard');
    } else setError('no profile');
  };

  const fetchJob = useCallback(async () => {
    const job = await getJob(id);
    setJob(job);
    setLoading(false);
  }, [id]);

  const fetchUserProfile = useCallback(async () => {
    if (user.role === 'Employee') {
      const profile = await getProfile(user.username, 'Employee');
      if (profile.error) setProfile(null);
      else setProfile(profile);
    }
  }, [user]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <div className="relative my-8 shadow rounded p-6 m-auto w-5/6 sm:w-1/2 bg-white">
      <div className="sm:w-5/6">
        <p className="text-blue-600 text-2xl font-bold text-center">
          {job.title}
        </p>
        <div className="mt-2 text-gray-700 text-sm">
          {(job.job_for_women || job.job_for_disabled) && (
            <p>
              {job.job_for_women && (
                <button className="mr-2 mt-2 rounded-sm text-white px-2 text-pink-600 border border-pink-600">
                  Jobs for Women
                </button>
              )}
              {job.job_for_disabled && (
                <button className="mt-2 rounded-sm text-white px-2 text-green-600 border border-green-600">
                  Jobs for Disabled
                </button>
              )}
            </p>
          )}
          <p className="mt-1">
            <span className="font-bold">Job ID: </span>
            {id}
          </p>
          <p className="mt-1">
            <span className="font-bold">Company Name: </span>
            <Link
              to={`/org/${job.company_name}`}
              className="uppercase font-bold text-blue-600 hover:underline">
              {job.company_name}
            </Link>
          </p>
          {job.website && (
            <p className="mt-1">
              <span className="font-bold">Website: </span>
              <a href={job.website} className="text-blue-600 hover:underline">
                {job.website}
              </a>
            </p>
          )}
          <p className="mt-1">
            <span className="font-bold">Salary: </span>
            {job.salary} (₹) (per month)
          </p>
          <p className="mt-1">
            <span className="font-bold">Age Limit: </span>
            {job.age_limit}
          </p>
          <p className="mt-1">
            <span className="font-bold">Min. Qualification: </span>
            {job.qualification}
          </p>
          <p className="mt-1">
            <span className="font-bold">Number of Vacancies: </span>
            {job.vacancies}
          </p>
          <p className="mt-1">
            <span className="font-bold">Job Type: </span>
            {job.type}
          </p>
          <p className="mt-1">
            <span className="font-bold">Job Category: </span>
            {job.category}
          </p>
          <p className="mt-1">
            <span className="font-bold">Min. Experience Required: </span>
            {job.experience} {job.experience === 1 ? 'year' : 'years'}
          </p>
          <p className="mt-1">
            <span className="font-bold">Last date to apply: </span>
            {new Date(job.last_date.substring(0, 10)).toLocaleDateString()}
          </p>
          <p className="mt-1">
            <span className="font-bold">Last updated on: </span>
            {new Date(job.updated_at.substring(0, 10)).toLocaleDateString()}
          </p>
          <p className="mt-1">
            <span className="font-bold">Job Description: </span>
            {job.summary}
          </p>
        </div>
        {job.doc_url && (
          <a
            className="md:absolute"
            href={job.doc_url}
            target="_blank"
            rel="noopener noreferrer"
            download={job.title}
            style={{ right: 30, top: 30 }}>
            <img
              title="Job document"
              src={job.doc_url}
              alt="document"
              className="mx-auto mt-2 md:mx-0 md:mt-0 h-48 w-40 border-2 border-gray-600 rounded"
            />
            <span className="font-bold text-center block">Job Document</span>
          </a>
        )}
      </div>
      {user.role === 'Employee' && (
        <button
          onClick={applyToJob}
          className="mt-3 w-full rounded-sm text-white py-1 px-4 bg-blue-600 hover:bg-blue-700 border border-blue-600"
          style={pending ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          disabled={pending}>
          {pending ? 'Applying to the Job...' : 'Apply to Job'}
        </button>
      )}
      {error === 'no profile' && (
        <p className="mt-1 text-sm text-red-600">
          Please{' '}
          <Link to="/createProfile" className="underline">
            create your profile
          </Link>{' '}
          before applying to a Job.
        </p>
      )}
    </div>
  );
}

export default Job;
