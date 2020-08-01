import React, { useState, useCallback, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import { getDomains, getQualifications } from 'utils';
import {
  uploadImage,
  summarizeTextFromImage,
  createJob,
  getProfile,
} from 'api';

import { StyledForm } from 'components/StyledForm';

function CreateJob({ user }) {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Choose a Document');
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    const imageData = await uploadImage(formData);
    return imageData.image.url;
  };

  const extractData = async (e) => {
    e.preventDefault();
    setExtracting(true);
    const { text, summarizedText } = await summarizeTextFromImage(
      jobDetails.doc_url,
    );
    setJobDetails((state) => ({ ...state, summary: summarizedText.trim() }));
    setJobDetails((state) => ({ ...state, description: text }));
    setExtracting(false);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.error) {
      if (file) {
        setError(true);
        setUploading(true);
        const image = await handleImageUpload();
        setJobDetails((state) => ({ ...state, doc_url: image }));
        setStep(2);
        setUploading(false);
      } else setError('Please choose a document!');
    } else setError('Please create your profile before posting a Job.');
  };

  const handleCheckboxChange = ({ target: { name } }) =>
    setJobDetails((state) => ({ ...state, [name]: !jobDetails[name] }));

  const handleJobDetailsChange = ({ target: { name, value } }) =>
    setJobDetails((state) => ({ ...state, [name]: value }));

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!userData.error) {
      setPending(true);
      const dataObj = {
        ...jobDetails,
        user: user.username,
        company_name: user.username,
      };
      await createJob(dataObj);
      history.push('/dashboard');
      setPending(false);
    } else setError('Please create your profile before posting a Job.');
  };

  const fetchUserData = useCallback(async () => {
    setError(null);
    const data = await getProfile(user.username, 'Employer');
    setUserData(data);
    setLoading(false);
  }, [user.username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (user.role === 'Employee')
    return (
      <div className="text-red-600 text-3xl font-bold m-auto">
        Please login as a Government organization to create a new Job.
      </div>
    );

  if (!userData || loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledForm className="create-job">
      {step === 1 && (
        <>
          <h1>Upload Job Document</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group sm:w-full">
              <p className="ml-1 text-gray-600">
                Please upload the document from which job description has to be
                read <br />
                (format can be image or .pdf or .docx) <br /> The document will
                be processed and you will get an editable description.
              </p>
              <label className="file-upload" htmlFor="file-upload">
                {`${
                  fileName !== 'Choose a Document' ? 'File: ' : ''
                }${fileName}`}
              </label>
              <input
                id="file-upload"
                name="image"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" disabled={uploading}>
              {!uploading ? 'Upload Document' : 'Uploading Document...'}
            </button>
            {error && <p className="error">{error}</p>}
            <p className="mx-1 text-gray-700">
              <span
                className="cursor-pointer underline"
                onClick={() => setStep(3)}>
                Click here
              </span>{' '}
              to create job by manually filling out the details
            </p>
          </form>
        </>
      )}
      {step === 2 && (
        <>
          <h1>Document Uploaded</h1>
          <p className="mx-1 flex flex-wrap text-gray-700">
            <span className="text-black font-bold">Document Name: </span>
            &nbsp;{fileName}
          </p>
          <form className="mt-2" onSubmit={extractData}>
            <p className="mx-1 text-lg text-gray-700">
              Please click the button below to Extract Job Description from the
              uploaded document.
            </p>
            <button type="submit" disabled={extracting}>
              {!extracting
                ? 'Extract Job Description'
                : 'Extracting Job Description...'}
            </button>
          </form>
        </>
      )}
      {step === 3 && (
        <>
          <h1>Edit Job Details</h1>
          <form onSubmit={handleCreateJob}>
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
                  onChange={handleCheckboxChange}
                  style={{ width: 'fit-content', cursor: 'pointer' }}
                />
                <span>Jobs for Women</span>
              </label>
              <label className="cursor-pointer flex text-gray-500 font-bold">
                <input
                  type="checkbox"
                  name="job_for_disabled"
                  onChange={handleCheckboxChange}
                  style={{ width: 'fit-content', cursor: 'pointer' }}
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
              {!pending ? 'Create Job' : 'Creating Job...'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </>
      )}
    </StyledForm>
  );
}

export default CreateJob;
