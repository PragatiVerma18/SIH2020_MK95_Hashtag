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
