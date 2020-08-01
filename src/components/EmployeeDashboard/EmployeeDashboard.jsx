import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link } from 'react-router-dom';

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
      {modal && (
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
                        j.status === 'Shortlisted') && (
                        <span
                          className="block mt-1 change-status"
                          title="Withdraw Application"
                          onClick={() => handleOpenModal(j.id)}>
                          (Withdraw Application)
                        </span>
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
