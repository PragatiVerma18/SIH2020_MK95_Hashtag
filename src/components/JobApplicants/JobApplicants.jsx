import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link, useParams } from 'react-router-dom';

import { getJobApplicants, updateApplicationStatus, sendEmail } from 'api';

import { useModal } from 'utils/customHooks/useModal';
import { getEmailTemplate } from 'utils';

import Modal from 'components/Modal';
import { StyledContainer } from 'components/StyledContainer';

const status = ['Shortlisted', 'Selected', 'Rejected', 'Ineligible'];

function JobApplicants({ user }) {
  const { id } = useParams();
  const [pending, setPending] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, showModal, hideModal] = useModal();
  const [jobStatus, setJobStatus] = useState('Select a Status');
  const [content, setContent] = useState('');
  const [candidate, setCandidate] = useState('');

  const fetchJobApplicants = useCallback(async () => {
    const applicants = await getJobApplicants(id);
    setApplicants(applicants);
    setLoading(false);
  }, [id]);

  const handleChange = ({ target: { value } }) => {
    setJobStatus(value);
    const emailContent = getEmailTemplate(
      value,
      candidate.employee.first_name,
      applicants[0].job.company_name,
      applicants[0].job.title,
    );
    setContent(emailContent[0].template);
  };

  const openModal = (ap) => {
    showModal();
    setCandidate(ap);
  };

  const closeModal = () => {
    setCandidate('');
    setJobStatus('Select a Status');
    hideModal();
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setPending(true);
    const emailPromise = sendEmail(
      candidate.employee.email,
      user.username,
      getEmailTemplate(
        jobStatus,
        candidate.employee.first_name,
        applicants[0].job.company_name,
        applicants[0].job.title,
      )[0].template,
    );
    const statusPromise = await updateApplicationStatus(candidate.id, {
      status: jobStatus,
    });
    await Promise.all([emailPromise, statusPromise]);
    setPending(false);
    closeModal();
    setLoading(true);
    fetchJobApplicants();
  };

  useEffect(() => {
    setContent(null);
  }, [hideModal]);

  useEffect(() => {
    fetchJobApplicants();
  }, [fetchJobApplicants]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (user.role === 'Employee')
    return (
      <div className="text-red-600 text-3xl font-bold m-auto">
        Please login as a Government organization to access this route.
      </div>
    );

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <>
      <StyledContainer>
        {modal && (
          <Modal title="Change Status" closeModal={hideModal}>
            <form className="mt-1" onSubmit={handleStatusUpdate}>
              <div>
                <label>Status:</label>
                <select name="jobStatus" onChange={handleChange}>
                  <option disabled selected>
                    Select a Status
                  </option>
                  {status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <label>Email content:</label>
                <textarea
                  className="h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="This content will be send to the job seeker via Email and SMS."></textarea>
              </div>
              <button type="submit" disabled={pending}>
                {pending ? 'Notifying Candiate...' : 'Notify Candiate'}
              </button>
            </form>
          </Modal>
        )}
        {!applicants.length ? (
          <p className="text-center text-2xl font-bold text-gray-800">
            No Applications are found for this Job
          </p>
        ) : (
          <>
            <h1>Applications for this Job</h1>
            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="w-1/6">Name</th>
                  <th className="w-1/6">Email</th>
                  <th className="w-1/6">Gender</th>
                  <th className="w-1/6">Age</th>
                  <th className="w-1/6">Phone Number</th>
                  <th className="w-1/6">Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants
                  .slice()
                  .reverse()
                  .map((ap) => (
                    <tr key={ap.employee.id}>
                      <td>
                        <Link to={`/profile/${ap.employee.user}`}>
                          {ap.employee.first_name} {ap.employee.last_name}
                        </Link>
                      </td>
                      <td>
                        <a href={`mailto:${ap.employee.email}`}>
                          {ap.employee.email}
                        </a>
                      </td>
                      <td className="capitalize">{ap.employee.gender}</td>
                      <td>
                        {Math.floor(
                          (new Date() - new Date(ap.employee.dob)) /
                            31536000000,
                        )}
                      </td>
                      <td>
                        <a href={`tel:${ap.employee.phone_number}`}>
                          {ap.employee.phone_number}
                        </a>
                      </td>
                      <td>
                        <span className={`relative status ${ap.status}`}>
                          {ap.status}
                        </span>
                        {(ap.status === 'Applied' ||
                          ap.status === 'Shortlisted') && (
                          <span
                            className="block mt-1 change-status"
                            title="Change Status"
                            onClick={() => openModal(ap)}>
                            (Change Status)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </StyledContainer>
    </>
  );
}

export default JobApplicants;
