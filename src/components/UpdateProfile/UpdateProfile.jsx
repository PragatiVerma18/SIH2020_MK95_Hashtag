import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import { updateProfile, uploadImage, getProfile } from 'api';

import Icon from 'components/Icon';
import { StyledForm } from 'components/StyledForm';

function UpdateProfile({ user }) {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [addAnotherEducation, setAddAnotherEducation] = useState(true);
  const [addAnotherWork, setAddAnotherWork] = useState(true);
  const [pending, setPending] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Choose an Image');
  const [employeeDetails, setEmployeeDetails] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    about: '',
    dob: '',
    phone_number: '',
    title: '',
    industry: '',
    location: '',
    skills: '',
    portfolio: '',
    github: '',
    linkedin: '',
    twitter: '',
    workexperience: [],
    education: [],
  });
  const [companyDetails, setCompanyDetails] = useState({
    company_name: '',
    website: '',
    location: '',
    company_size: 0,
    company_type: '',
    industry: '',
    overview: '',
    pan: '',
    full_form: '',
    linkedin: '',
    twitter: '',
  });

  const decStep = () => step !== 1 && setStep(step - 1);

  const incStep = () => step !== 4 && setStep(step + 1);

  const handleEmployeeDetails = ({ target: { name, value } }) => {
    setEmployeeDetails((state) => ({ ...state, [name]: value }));
  };

  const handleCompanyDetails = ({ target: { name, value } }) => {
    setCompanyDetails((state) => ({ ...state, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const addEducation = () => {
    const institution = document.getElementsByName('institution')[0].value;
    const degree = document.getElementsByName('degree')[0].value;
    const start_date = document.getElementsByName('start_date')[0].value;
    const end_date = document.getElementsByName('end_date')[0].value;
    const edu = [
      ...employeeDetails.education,
      { institution, degree, start_date, end_date },
    ];
    setEmployeeDetails((state) => ({ ...state, education: edu }));
    setAddAnotherEducation(false);
  };

  const deleteEducation = (date) => {
    const edu = [...employeeDetails.education];
    const newEdu = edu.filter((e) => e.start_date !== date);
    if (edu.length === 1) setAddAnotherEducation(true);
    setEmployeeDetails((state) => ({ ...state, education: newEdu }));
  };

  const addWork = () => {
    const company = document.getElementsByName('company')[0].value;
    const position = document.getElementsByName('position')[0].value;
    const start_date = document.getElementsByName('work-start_date')[0].value;
    const end_date = document.getElementsByName('work-end_date')[0].value;
    const location = document.getElementsByName('work-location')[0].value;
    const work = [
      ...employeeDetails.workexperience,
      { company, position, start_date, end_date, location },
    ];
    setEmployeeDetails((state) => ({ ...state, workexperience: work }));
    setAddAnotherWork(false);
  };

  const deleteWork = (date) => {
    const work = [...employeeDetails.workexperience];
    const newWork = work.filter((e) => e.start_date !== date);
    if (work.length === 1) setAddAnotherWork(true);
    setEmployeeDetails((state) => ({ ...state, workexperience: newWork }));
  };

  const handleProfileImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    const imageData = await uploadImage(formData);
    return imageData.image.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    let image = null;
    if (file) image = await handleProfileImageUpload();
    const dataObj = Object.assign(
      { user: user.username, email: user.email, image },
      user.role === 'Employee' ? employeeDetails : companyDetails,
    );
    const data = await updateProfile(user.username, user.role, dataObj);
    if (data.error) setError(data.error);
    else {
      user.role === 'Employee'
        ? history.push(`/profile/${user.username}`)
        : history.push(`/org/${user.username}`);
    }
    setPending(false);
  };

  const fetchUserProfile = useCallback(async () => {
    const { username, role } = user;
    const data = await getProfile(username, role);
    if (user.role === 'Employee') {
      data.phone_number = data.phone_number && data.phone_number.substring(3);
      setEmployeeDetails(data);
    } else {
      setCompanyDetails(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <div className="rounded-lg bg-white mx-auto my-8 px-6 sm:px-8">
      <StyledForm className="shadow-none">
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          {user.role === 'Employee' ? (
            <>
              {step === 1 && (
                <>
                  <p className="m-2 text-lg font-bold text-gray-600 text-center">
                    Basic Details
                  </p>
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>
                        First Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: John"
                        name="first_name"
                        value={employeeDetails.first_name}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>
                        Last Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Doe"
                        name="last_name"
                        value={employeeDetails.last_name}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                  <div className="input-group sm:w-full">
                    <label>
                      Gender <span>*</span>
                    </label>
                    <select
                      className="sm:w-full"
                      name="gender"
                      onChange={(e) => handleEmployeeDetails(e)}
                      value={employeeDetails.gender}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>
                        DOB <span>*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={employeeDetails.dob}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>Phone number</label>
                      <input
                        type="number"
                        placeholder="Eg: 9999999999"
                        name="phone_number"
                        value={employeeDetails.phone_number}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>
                        City of residence <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Delhi"
                        name="location"
                        value={employeeDetails.location}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>
                        Title <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Product Manager"
                        name="title"
                        value={employeeDetails.title}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                  <div className="input-group sm:w-full">
                    <p className="ml-1 text-gray-600">Photo</p>
                    <label className="file-upload" htmlFor="file-upload">
                      {`${
                        fileName !== 'Choose an Image' ? 'File: ' : ''
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
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>
                        Industry <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Telecom"
                        name="industry"
                        value={employeeDetails.industry}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>
                        Skills (comma seperated) <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Designing, Communication"
                        name="skills"
                        value={employeeDetails.skills}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                  <div className="textarea input-group sm:w-full">
                    <label>About Yourself</label>
                    <textarea
                      className="h-20 sm:w-full"
                      placeholder="Describe yourself in 200 words"
                      name="about"
                      maxLength="200"
                      value={employeeDetails.about}
                      onChange={(e) => handleEmployeeDetails(e)}
                    />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <p className="m-2 text-lg font-bold text-gray-600 text-center">
                      Educational Qualification
                    </p>
                    {employeeDetails.education.map((ed) => (
                      <div className="education" key={ed.start_date}>
                        <p>
                          {ed.institution} - {ed.degree}
                        </p>
                        <p>
                          {ed.start_date} - {ed.end_date}
                        </p>
                        <span
                          title="delete"
                          onClick={() => deleteEducation(ed.start_date)}>
                          X
                        </span>
                      </div>
                    ))}
                    {addAnotherEducation && (
                      <>
                        <div className="flex flex-col sm:flex-row">
                          <div className="input-group">
                            <label>Institute</label>
                            <input
                              type="text"
                              name="institution"
                              placeholder="Eg: IIT Delhi"
                            />
                          </div>
                          <div className="input-group sm:ml-2">
                            <label>Degree</label>
                            <input
                              type="text"
                              name="degree"
                              placeholder="Eg: B.Tech"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <div className="input-group">
                            <label>Start date</label>
                            <input type="date" name="start_date" />
                          </div>
                          <div className="input-group sm:ml-2">
                            <label>End date</label>
                            <input type="date" name="end_date" />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex justify-center">
                      {addAnotherEducation ? (
                        <button type="button" onClick={addEducation}>
                          Add Education
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddAnotherEducation(true)}>
                          Add Another Education
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <p className="m-2 text-lg font-bold text-gray-600 text-center">
                      Work Experience
                    </p>
                    {employeeDetails.workexperience.map((work) => (
                      <div className="work" key={work.start_date}>
                        <p>
                          {work.company}, {work.location} - {work.position}
                        </p>
                        <p>
                          {work.start_date} - {work.end_date}
                        </p>
                        <span
                          title="delete"
                          onClick={() => deleteWork(work.start_date)}>
                          X
                        </span>
                      </div>
                    ))}
                    {addAnotherWork && (
                      <>
                        <div className="flex flex-col sm:flex-row">
                          <div className="input-group">
                            <label>Company</label>
                            <input
                              type="text"
                              placeholder="Eg: IOCL"
                              name="company"
                            />
                          </div>
                          <div className="input-group sm:ml-2">
                            <label>Position</label>
                            <input
                              type="text"
                              placeholder="Eg: Manager"
                              name="position"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <div className="input-group">
                            <label>Start date</label>
                            <input type="date" name="work-start_date" />
                          </div>
                          <div className="input-group sm:ml-2">
                            <label>End date</label>
                            <input type="date" name="work-end_date" />
                          </div>
                        </div>
                        <div>
                          <div className="input-group">
                            <label>Location</label>
                            <input
                              type="text"
                              placeholder="Eg: Noida"
                              name="work-location"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex justify-center">
                      {addAnotherWork ? (
                        <button type="button" onClick={addWork}>
                          Add Work Experience
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddAnotherWork(true)}>
                          Add Another Work Experience
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <p className="m-2 text-lg font-bold text-gray-600 text-center">
                    Profile Links
                  </p>
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>LinkedIn</label>
                      <input
                        type="text"
                        placeholder="LinkedIn profile"
                        name="linkedin"
                        value={employeeDetails.linkedin}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>Twitter</label>
                      <input
                        type="text"
                        placeholder="Twitter Profile"
                        name="twitter"
                        value={employeeDetails.twitter}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="input-group">
                      <label>GitHub</label>
                      <input
                        type="text"
                        placeholder="GitHub profile"
                        name="github"
                        value={employeeDetails.github}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                    <div className="input-group sm:ml-2">
                      <label>Resume Link</label>
                      <input
                        type="text"
                        placeholder="Online Resume link"
                        name="portfolio"
                        value={employeeDetails.portfolio}
                        onChange={(e) => handleEmployeeDetails(e)}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="buttons flex justify-between w-full">
                {step !== 1 && (
                  <button
                    type="button"
                    onClick={decStep}
                    disabled={pending}
                    className="flex items-center">
                    <Icon name="chevron-left" />
                    &nbsp; Prev Step
                  </button>
                )}
                {step !== 4 && (
                  <button
                    type="button"
                    onClick={incStep}
                    className="flex items-center">
                    Next Step &nbsp;
                    <Icon name="chevron-right" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row">
                <div className="input-group">
                  <label>
                    Organization <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: MHRD"
                    name="company_name"
                    value={companyDetails.company_name}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
                <div className="input-group sm:ml-2">
                  <label>Org's full name (if exists)</label>
                  <input
                    type="text"
                    placeholder="Eg: Oil and Natural Gas Corporation"
                    name="full_form"
                    value={companyDetails.full_form}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="input-group">
                  <label>Website</label>
                  <input
                    type="text"
                    placeholder="Eg: https://abc.com"
                    name="website"
                    value={companyDetails.website}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
                <div className="input-group sm:ml-2">
                  <label>
                    Pan number <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: ADUPV1245D"
                    name="pan"
                    value={companyDetails.pan}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="input-group">
                  <label>
                    Location <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: Delhi"
                    name="location"
                    value={companyDetails.location}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
                <div className="input-group sm:ml-2">
                  <label>
                    Industry <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: IT sector"
                    name="industry"
                    value={companyDetails.industry}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="input-group">
                  <label>
                    Organization size <span>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Eg: 200"
                    name="company_size"
                    value={companyDetails.company_size}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
                <div className="input-group sm:ml-2">
                  <label>
                    Organization type <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Eg: Central Government"
                    name="company_type"
                    value={companyDetails.company_type}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
              </div>
              <div className="input-group sm:w-full">
                <p className="ml-1 text-gray-600">Organization Logo</p>
                <label className="file-upload" htmlFor="file-upload">
                  {`${
                    fileName !== 'Choose an Image' ? 'File: ' : ''
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
              <div className="textarea input-group sm:w-full">
                <label>
                  Description <span>*</span>
                </label>
                <textarea
                  className="h-20 sm:w-full"
                  placeholder="Company description..."
                  name="overview"
                  value={companyDetails.overview}
                  onChange={(e) => handleCompanyDetails(e)}
                />
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="input-group">
                  <label>LinkedIn</label>
                  <input
                    type="text"
                    placeholder="LinkedIn profile"
                    name="linkedin"
                    value={companyDetails.linkedin}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
                <div className="input-group sm:ml-2">
                  <label>Twitter</label>
                  <input
                    type="text"
                    placeholder="Twitter Profile"
                    name="twitter"
                    value={companyDetails.twitter}
                    onChange={(e) => handleCompanyDetails(e)}
                  />
                </div>
              </div>
            </>
          )}
          {(user.role === 'Employer' || step === 4) && (
            <button type="submit" disabled={pending}>
              {pending ? 'Updating Details...' : 'Update Details'}
            </button>
          )}
          {!pending && error && <p className="error">{error}</p>}
        </form>
      </StyledForm>
    </div>
  );
}

export default UpdateProfile;
