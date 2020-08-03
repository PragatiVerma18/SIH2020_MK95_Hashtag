import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, Link, useParams } from 'react-router-dom';
import * as moment from 'moment';

import { getJobApplicants, updateApplicationStatus, sendEmail } from 'api';

import { useModal } from 'utils/customHooks/useModal';
import { getEmailTemplate } from 'utils';

import Modal from 'components/Modal';
import { StyledContainer } from 'components/StyledContainer';

const status = [
  'Shortlisted',
  'Selected',
  'Rejected',
  'Ineligible',
  'Selected for Interview',
];

const gapi = window.gapi;
const CLIENT_ID = process.env.REACT_APP_CLIENTID;
const API_KEY = process.env.REACT_APP_API_KEY;
var DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
var SCOPES = 'https://www.googleapis.com/auth/calendar';

function JobApplicants({ user }) {
  const { id } = useParams();
  const [pending, setPending] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, showModal, hideModal] = useModal();
  const [jobStatus, setJobStatus] = useState('Select a Status');
  const [content, setContent] = useState('');
  const [candidate, setCandidate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState('');

  // google calendar api
  const createEvent = async (e) => {
    e.preventDefault();
    setPending(true);
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          const event = {
            summary: 'Interview Schedule',
            location: location,
            description: `Interview for the post of ${applicants[0].job.company_name} at ${applicants[0].job.title}`,
            start: {
              dateTime: new Date(startDate).toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            end: {
              dateTime: new Date(endDate).toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
            attendees: [{ email: candidate.employee.email }],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 10 },
              ],
            },
          };

          const request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            sendUpdates: 'all',
            resource: event,
          });

          request.execute((event) => {
            window.open(event.htmlLink);
            handleStatusUpdate();
          });
        });
    });
  };

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    await handleStatusUpdate();
  };

  const handleStatusUpdate = async () => {
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
      status: jobStatus !== 'Selected for Interview' ? jobStatus : 'Interview',
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
            <form
              className="mt-1"
              onSubmit={
                jobStatus !== 'Selected for Interview'
                  ? handleFormSubmit
                  : createEvent
              }>
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
                {jobStatus === 'Selected for Interview' && (
                  <>
                    <div>
                      <div>
                        <label>Start Time</label>
                        <input
                          type="datetime-local"
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>End Time</label>
                        <input
                          type="datetime-local"
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <label className="block mt-3">
                        <span className="block">Interview type</span>
                        <label className="inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isOnline}
                            style={{
                              display: 'flex',
                              width: 'auto',
                              marginRight: 5,
                            }}
                            onChange={() => setIsOnline((state) => !state)}
                          />
                          <span>Online</span>
                        </label>
                        <label className="ml-4 inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!isOnline}
                            style={{
                              display: 'flex',
                              width: 'auto',
                              marginRight: 5,
                            }}
                            onChange={() => setIsOnline((state) => !state)}
                          />
                          <span>Offline</span>
                        </label>
                      </label>
                      {!isOnline && (
                        <>
                          <label className="mt-3">Interview Location</label>
                          <input
                            type="text"
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-2">
                <label>Email content:</label>
                <textarea
                  className="h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="This content will be send to the job seeker via Email and SMS."></textarea>
              </div>
              {jobStatus !== 'Selected for Interview' ? (
                <button type="submit" disabled={pending}>
                  {pending ? 'Notifying Candidate...' : 'Notify Candidate'}
                </button>
              ) : (
                <button type="submit" disabled={pending}>
                  {pending ? 'Scheduling Interview...' : 'Schedule Interview'}
                </button>
              )}
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Time taken</th>
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
                          ap.status === 'Shortlisted' ||
                          ap.status === 'Interview') && (
                          <span
                            className="block mt-1 change-status"
                            title="Change Status"
                            onClick={() => openModal(ap)}>
                            (Change Status)
                          </span>
                        )}
                      </td>
                      <td>
                        {ap.status === 'Selected' ||
                        ap.status === 'Rejected' ||
                        ap.status === 'Ineligible' ? (
                          <span>
                            <span>
                              {`${moment
                                .duration(
                                  new Date(ap.updated_at) -
                                    new Date(ap.job.created_at),
                                )
                                .days()} days`}
                            </span>
                            <span>
                              {` ${moment
                                .duration(
                                  new Date(ap.updated_at) -
                                    new Date(ap.job.created_at),
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
            </table>
          </>
        )}
      </StyledContainer>
    </>
  );
}

export default JobApplicants;
