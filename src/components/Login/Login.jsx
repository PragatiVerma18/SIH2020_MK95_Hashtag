import React, { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';

import { login } from 'api';

import { StyledForm } from 'components/StyledForm';
import Icon from 'components/Icon';

function Login({ setUser }) {
  const history = useHistory();

  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    setPending(true);
    setError(null);
    e.preventDefault();
    const data = await login({ username: userName, password });
    if (data.error) setError(data.error);
    else {
      const { username, role, email } = data;
      setUser({ username, role, email });
      localStorage.setItem('user', JSON.stringify({ username, role, email }));
      history.push('/dashboard');
    }
    setPending(false);
  };

  if (localStorage.getItem('token')) return <Redirect to="/dashboard" />;

  return (
    <StyledForm width="360px">
      {step === 1 && (
        <div>
          <h1>Choose your Role</h1>
          <div className="w-full flex flex-col justify-center">
            <button
              className="w-full mx-auto py-1"
              style={{ margin: '0.35rem auto' }}
              onClick={() => setStep(2)}>
              <Icon style={{ display: 'inline' }} name="job-seeker" />
              &nbsp; Login as a Job Seeker
            </button>
            <button
              className="w-full mx-auto py-1"
              style={{ margin: '0.35rem auto' }}
              onClick={() => setStep(2)}>
              <Icon style={{ display: 'inline' }} name="org" />
              &nbsp; Login as an Organization
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
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={pending}>
              {!pending ? 'Login' : 'Logging in...'}
            </button>
            {error && <p className="error">{error}</p>}
            <p>
              Don't have an account? <Link to="/signup">Sign Up!</Link>
            </p>
          </form>
        </>
      )}
    </StyledForm>
  );
}

export default Login;
