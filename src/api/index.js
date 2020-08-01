import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const algorithmiaApiKey = process.env.REACT_APP_ALGORITHMIA_KEY;

export const uploadImage = async (formData) => {
  try {
    const token = process.env.REACT_APP_IMGBB_API_KEY;
    const url = `${process.env.REACT_APP_IMAGEBB_URL}?key=${token}`;
    const options = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const {
      data: { data },
    } = await axios.post(url, formData, options);
    return data;
  } catch (err) {
    return { err: err.response.data.error.message };
  }
};

export const login = async (dataObj) => {
  try {
    const {
      data: { data },
    } = await axios.post(`${baseUrl}/accounts/login/`, dataObj);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return err.response.data;
  }
};

export const signUp = async (dataObj, role) => {
  try {
    const reqUrl =
      role === 'Employee'
        ? '/accounts/employeeregister/'
        : '/accounts/employerregister/';
    const { data } = await axios.post(`${baseUrl}${reqUrl}`, dataObj);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return { error: 'Something went wrong!' };
  }
};

export const createProfile = async (dataObj, role) => {
  try {
    const reqUrl =
      role === 'Employee'
        ? '/profile/create-employee-profile/'
        : '/profile/create-employer-profile/';
    const { data } = await axios.post(`${baseUrl}${reqUrl}`, dataObj);
    return data;
  } catch (err) {
    console.log(err.response);
    return { error: 'Something went wrong!' };
  }
};

export const getProfile = async (username, role) => {
  try {
    const reqUrl =
      role === 'Employee' ? '/employeeprofile/' : '/employerprofile/';
    const { data } = await axios.get(`${baseUrl}/profile${reqUrl}${username}`);
    return data;
  } catch (err) {
    return { error: err.response.data };
  }
};

export const updateProfile = async (username, role, dataObj) => {
  try {
    console.log(dataObj);
    const reqUrl =
      role === 'Employee' ? '/employeeprofile/' : '/employerprofile/';
    const { data } = await axios.put(
      `${baseUrl}/profile${reqUrl}${username}/`,
      dataObj,
    );
    return data;
  } catch (err) {
    return { error: err.response.data };
  }
};

export const createJob = async (jobData) => {
  try {
    const { data } = await axios.post(`${baseUrl}/jobs/create-job/`, jobData);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getAllJobs = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/jobs/jobs/`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getJob = async (id) => {
  try {
    const { data } = await axios.get(`${baseUrl}/jobs/update/${id}`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getJobsByFilters = async (location, title) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/jobs/search?location=${location}&title=${title}`,
    );
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const updateJob = async (id, dataObj) => {
  try {
    const { data } = await axios.put(`${baseUrl}/jobs/update/${id}/`, dataObj);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const deleteJob = async (id) => {
  try {
    const { data } = await axios.delete(`${baseUrl}/jobs/update/${id}/`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const applyJob = async (obj) => {
  try {
    const data = await axios.post(`${baseUrl}/jobs/apply-job/${obj.job}`, obj);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getOrgJobs = async (username) => {
  try {
    const { data } = await axios.get(`${baseUrl}/jobs/employer/${username}`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getEmployeeJobs = async (username) => {
  try {
    const { data } = await axios.get(`${baseUrl}/jobs/applied/${username}`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const getJobApplicants = async (id) => {
  try {
    const { data } = await axios.get(`${baseUrl}/jobs/applicants/${id}`);
    return data;
  } catch (err) {
    console.log(err.response);
  }
};

export const updateApplicationStatus = async (id, dataObj) => {
  try {
    console.log(id, dataObj);
    await axios.patch(`${baseUrl}/jobs/status/${id}`, dataObj);
  } catch (err) {
    console.log(err.response);
  }
};

// external APIs
export const extractText = async (image, language = 'eng') => {
  const { result } = await window.Algorithmia.client(algorithmiaApiKey)
    .algo('ocr/RecognizeCharacters/0.3.0?timeout=300')
    .pipe(image);
  return result;
};

export const summarizeText = async (input) => {
  const { result } = await window.Algorithmia.client(algorithmiaApiKey)
    .algo('nlp/Summarizer/0.1.8?timeout=300')
    .pipe(input);
  return result;
};

export const summarizeTextFromImage = async (image, language) => {
  const text = await extractText(image, language);
  const summarizedText = await summarizeText(text);
  return { text, summarizedText };
};

export const getNews = async () => {
  try {
    const { data } = await axios.get(
      `https://cors-anywhere.herokuapp.com/http://newsapi.org/v2/everything?q=govt-india-job&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`,
    );
    return data.articles;
  } catch (err) {
    console.log(err.response);
  }
};

export const sendEmail = async (id, org, body) => {
  const msg = await window.Email.send({
    SecureToken: process.env.REACT_APP_SMTP_SECURE_TOKEN,
    To: id,
    From: 'rajatverma5885045@gmail.com',
    Subject: `Regarding application at ${org}`,
    Body: body,
  });
  return msg;
};
