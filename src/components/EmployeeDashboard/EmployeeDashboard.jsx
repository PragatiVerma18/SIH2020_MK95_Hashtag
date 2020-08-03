import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link } from 'react-router-dom';
import * as moment from 'moment';

import { getEmployeeJobs, updateApplicationStatus } from 'api';
import { useModal } from 'utils/customHooks/useModal';

import Modal from 'components/Modal';
import { StyledContainer } from 'components/StyledContainer';

function EmployeeDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState();
  const [pending, setPending] = useState(false);
  const [modal, showModal, hideModal] = useModal();
  const [jobID, setJobID] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleOpenModal = (id) => {
    showModal();
    setJobID(id);
  };

  const handleWithdrawl = async (e) => {
    e.preventDefault();
    setPending(true);
    await updateApplicationStatus(jobID, { status: 'Withdrawn' });
    setPending(false);
    hideModal();
    fetchEmployeeJobs();
  };

  const showCertiModal = (job) => {
    setSelectedJob(job);
    showModal();
  };

  const hideCertiModal = () => {
    setSelectedJob(null);
    hideModal();
  };

  const fetchEmployeeJobs = useCallback(async () => {
    setLoading(true);
    const jobs = await getEmployeeJobs(user.username);
    setJobs(jobs);
    setLoading(false);
  }, [user.username]);

  useEffect(() => {
    fetchEmployeeJobs();
  }, [fetchEmployeeJobs]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading || !user.username)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledContainer>
      {modal && !selectedJob && (
        <Modal
          modal={modal}
          closeModal={hideModal}
          title="Withdraw Application">
          <h1 className="mb-2 text-xl">
            Do you really want to withdraw your application from this Job?
          </h1>
          <div className="flex">
            <button className="mr-4" onClick={hideModal}>
              Cancel
            </button>
            <button
              style={{ backgroundColor: '#d52b1bed' }}
              onClick={handleWithdrawl}
              disabled={pending}>
              {pending ? 'Withdrawing ...' : 'Withdraw'}
            </button>
          </div>
        </Modal>
      )}
      {modal && selectedJob && (
        <Modal modal={modal} closeModal={hideCertiModal}>
          <div className="p-8 m-3 border-4 border-blue-600">
            <img
              className="w-40 mb-3 m-auto"
              src={require('assets/awsar.png')}
              alt="Awsar logo"
            />
            <h1 className="uppercase tracking-wide text-3xl font-bold text-blue-700 text-center mb-3">
              Certificate of Selection
            </h1>
            <p className="text-gray-700 text-xl">
              This is to certify that{' '}
              <span className="font-bold capitalize">{user.username}</span> has
              been selected for the post of{' '}
              <span className="font-bold capitalize">{selectedJob.title}</span>{' '}
              in
              <span className="font-bold uppercase">
                {' '}
                {selectedJob.company_name}.
              </span>
            </p>
            <p className="text-gray-700 text-xl mt-2">
              All the very best for your new job. May you enjoy it at the
              fullest and climb up the success stairs eventually.
            </p>
          </div>
        </Modal>
      )}

      {!jobs.length ? (
        <h1>
          You have not applied for any Jobs yet. Visit{' '}
          <Link to="/jobs">Jobs</Link> to get started.
        </h1>
      ) : (
        <>
          <h1>My Applications</h1>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Organization</th>
                <th>Job Type</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .slice()
                .reverse()
                .map((j) => (
                  <tr key={j.applied_at}>
                    <td>
                      <Link to={`/job/${j.job.id}`}>{j.job.title}</Link>
                    </td>
                    <td className="uppercase">
                      <Link to={`/org/${j.job.company_name}`}>
                        {j.job.company_name}
                      </Link>
                    </td>
                    <td>{j.job.type}</td>
                    <td>{j.applied_at.substring(0, 10)}</td>
                    <td>
                      <span className={`status ${j.status}`}>{j.status}</span>
                      {(j.status === 'Applied' ||
                        j.status === 'Shortlisted' ||
                        j.status === 'Interview') && (
                        <span
                          className="block mt-1 change-status"
                          title="Withdraw Application"
                          onClick={() => handleOpenModal(j.id)}>
                          (Withdraw Application)
                        </span>
                      )}
                      {j.status === 'Selected' && (
                        <span
                          className="block mt-1 change-status"
                          title="Download Certificate"
                          onClick={() => showCertiModal(j.job)}>
                          (See Certificate)
                        </span>
                      )}
                    </td>
                    <td>
                      {j.status === 'Selected' ||
                      j.status === 'Rejected' ||
                      j.status === 'Ineligible' ? (
                        <span>
                          <span>
                            {`${moment
                              .duration(
                                new Date(j.updated_at) - new Date(j.created_at),
                              )
                              .days()} days`}
                          </span>
                          <span>
                            {` ${moment
                              .duration(
                                new Date(j.updated_at) - new Date(j.applied_at),
                              )
                              .hours()} hours`}
                          </span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>{' '}
        </>
      )}
    </StyledContainer>
  );
}

export default EmployeeDashboard;
