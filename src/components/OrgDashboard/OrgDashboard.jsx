import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { getOrgJobs, deleteJob } from 'api';
import { useModal } from 'utils/customHooks/useModal';

import Modal from 'components/Modal';
import Icon from 'components/Icon';
import { StyledContainer } from 'components/StyledContainer';

function OrgDashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [modal, showModal, hideModal] = useModal();
  const [jobId, setJobId] = useState(null);
  const [pending, setPending] = useState(false);

  const categories = jobs
    .map((j) => j.category)
    .reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);

  const handleDeleteJob = async () => {
    setPending(true);
    await deleteJob(jobId);
    setPending(false);
    hideModal();
    fetchJobs();
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const jobs = await getOrgJobs(user.username);
    setJobs(jobs);
    setLoading(false);
  }, [user, setLoading, setJobs]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading || !user.username)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledContainer className="p-6">
      {modal && (
        <Modal modal={modal} title="Delete Job" closeModal={hideModal}>
          <h1 className="mb-2 text-xl">
            Do you want to permanently delete this Job?
          </h1>
          <div className="flex">
            <button className="mr-4" onClick={hideModal}>
              Cancel
            </button>
            <button
              style={{ backgroundColor: '#d52b1bed' }}
              onClick={handleDeleteJob}
              disabled={pending}>
              {pending ? 'Deleting Job...' : 'Delete Job'}
            </button>
          </div>
        </Modal>
      )}
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:1/2 md:w-1/4">
          <div className="flex text-xl justify-center items-center text-gray-800 flex-col font-bold bg-white my-2 mx-4 sm:mx-2 p-6 shadow rounded">
            {jobs.length ? (
              jobs[0].user.verified ? (
                <>
                  <Icon name="verified" />
                  <p>Verified Account</p>
                </>
              ) : (
                <>
                  <Icon name="unverified" />
                  <a className="text-blue-600" href="mailto:support@awsar.com">
                    <p title="Verify me">Unverified</p>
                  </a>
                </>
              )
            ) : (
              <>
                <Icon name="unverified" />
                <a className="text-blue-600" href="mailto:support@awsar.com">
                  <p title="Verify me">Unverified</p>
                </a>
              </>
            )}
          </div>
        </div>
        <div className="relative w-full sm:1/2 md:w-1/4">
          <div className="flex text-xl justify-center items-center text-gray-800 flex-col font-bold bg-white my-2 mx-4 sm:mx-2 p-6 shadow rounded">
            <Icon name="job" />
            <p>
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Created
            </p>
          </div>
        </div>
        <div className="relative w-full sm:1/2 md:w-1/4">
          <div className="flex text-xl justify-center items-center text-gray-800 flex-col font-bold bg-white my-2 mx-4 sm:mx-2 p-6 shadow rounded">
            <Icon name="people" />
            <p>121 Applicants</p>
          </div>
        </div>
        <div className="relative w-full sm:1/2 md:w-1/4">
          <div className="flex text-xl justify-center items-center text-gray-800 flex-col font-bold bg-white my-2 mx-4 sm:mx-2 p-6 shadow rounded">
            <Icon name="categories" />
            <p>
              {categories.length}{' '}
              {categories.length === 1 ? 'Category' : 'Categories'} Covered
            </p>
          </div>{' '}
        </div>
      </div>

      <h1 className="mt-2 text-xl text-blue-600 text-center">
        Jobs by <span className="uppercase">{user.username}</span>
      </h1>
      {jobs.length ? (
        <div>
          {jobs
            .slice()
            .reverse()
            .map((job) => (
              <div
                key={job.id}
                className="relative w-full sm:inline-block sm:w-1/2 md:w-1/4 ">
                <div className="text-gray-800 bg-white mx-4 my-2 sm:m-2 p-6 shadow rounded">
                  <Link
                    to={`job/${job.id}`}
                    className="hover:underline flex justify-center text-lg font-bold text-center text-blue-600">
                    {job.title}
                  </Link>
                  <div className="mt-1 text-sm">
                    <p>
                      <span className="font-bold">Number of Applicants: </span>
                      {110}
                    </p>
                    <p>
                      <span className="font-bold">Vacancies: </span>
                      {job.vacancies}
                    </p>
                    <p>
                      <span className="font-bold">Location: </span>
                      {job.location}
                    </p>
                    <p>
                      <span className="font-bold">Salary: </span>
                      {job.salary} (₹) (per month)
                    </p>
                    {job.job_for_women || job.job_for_disabled ? (
                      <div className="mt-1">
                        {job.job_for_women && (
                          <button className="women-job">Jobs for Women</button>
                        )}
                        {job.job_for_disabled && (
                          <button className="disabled-job">
                            Jobs for Disabled
                          </button>
                        )}
                      </div>
                    ) : (
                      <button className="general">General</button>
                    )}
                    <div style={{ position: 'absolute', top: 18, right: 18 }}>
                      <Link
                        to={`/updateJob/${job.id}`}
                        title="Edit Job"
                        className="transition ease-in duration-100 bg-gray-700 hover:bg-gray-900 rounded-full h-8 w-8 flex items-center justify-center">
                        <Icon name="edit" />
                      </Link>
                      <span
                        title="Delete Job"
                        className="cursor-pointer mt-2 transition ease-in duration-100 bg-gray-700 hover:bg-gray-900 rounded-full h-8 w-8 flex items-center justify-center"
                        onClick={() => {
                          showModal();
                          setJobId(job.id);
                        }}>
                        <Icon name="delete" />
                      </span>
                    </div>
                    <Link
                      to={`job/applicants/${job.id}`}
                      className="block transition duration-150 ease-in-out rounded mt-1 py-1 px-2 border border-blue-600 text-center bg-blue-600 text-white hover:bg-white hover:text-blue-600">
                      See Job Applications
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-xl font-medium text-center">
          <p>No Jobs found!</p>
          <p>
            Click{' '}
            <Link to="/createJob" className="text-blue-600 hover:underline">
              here
            </Link>{' '}
            to create a Job
          </p>
        </div>
      )}
    </StyledContainer>
  );
}

export default OrgDashboard;
