import React, { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';

import { signUp } from 'api';
import { StyledForm } from 'components/StyledForm';
import Icon from 'components/Icon';

function Signup({ setUser }) {
  const history = useHistory();

  const [step, setStep] = useState(1);
  const [userRole, setUserRole] = useState('Employee');
  const [pending, setPending] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);

  function passwordValidation() {
    if (password !== password2) {
      setError("Password don't match");
      return false;
    } else if (
      password.length < 6 ||
      password.length > 50 ||
      password.search(/\d/) === -1 ||
      password.search(/[a-zA-Z]/) === -1 ||
      // eslint-disable-next-line no-useless-escape
      password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) !== -1
    ) {
      setError('Please use a stronger password!');
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordValidation()) {
      setPending(true);
      setError(null);
      const data = await signUp(
        { username: userName, password, password2, email: userEmail },
        userRole,
      );
      if (data.error) setError(data.error);
      else {
        const { username, role, email } = data;
        setUser({ username, role, email });
        localStorage.setItem('user', JSON.stringify({ username, role, email }));
        history.push('/createProfile');
      }
      setPending(false);
    }
  };

  if (localStorage.getItem('token')) return <Redirect to="/dashboard" />;

  return (
    <StyledForm width="380px">
      {step === 1 && (
        <div>
          <h1>Choose your Role</h1>
          <div className="w-full flex flex-col justify-center">
            <button
              className="w-full mx-auto py-1"
              style={{ margin: '0.35rem auto' }}
              onClick={() => {
                setUserRole('Employee');
                setStep(2);
              }}>
              <Icon style={{ display: 'inline' }} name="job-seeker" />
              &nbsp; Sign Up as a Job Seeker
            </button>
            <button
              className="w-full mx-auto py-1"
              style={{ margin: '0.35rem auto' }}
              onClick={() => {
                setUserRole('Employer');
                setStep(2);
              }}>
              <Icon style={{ display: 'inline' }} name="org" />
              &nbsp; Sign Up as an Organization
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <>
          <button
            className="absolute h-8 w-8 flex justify-center items-center bg-blue-600 hover:blue-700"
            style={{ top: 10, left: 15, borderRadius: '50%' }}
            onClick={() => setStep(1)}>
            <Icon name="go-back" />
          </button>
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              onChange={(e) => setPassword2(e.target.value)}
            />
            <button type="submit" disabled={pending}>
              {!pending ? 'Sign Up' : 'Signing Up...'}
            </button>
            {error && <p className="error">{error}</p>}
            <p>
              Already have an account? <Link to="/login">Login!</Link>
            </p>
          </form>
        </>
      )}
    </StyledForm>
  );
}

export default Signup;
