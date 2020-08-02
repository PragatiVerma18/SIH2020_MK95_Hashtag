import React from 'react';
import { Link } from 'react-router-dom';

import Icon from 'components/Icon';

import './styles/Navbar.css';

const Navbar = ({ user, setUser }) => {
  const print = () => window.print();

  const signOut = () => {
    setUser({});
    localStorage.clear();
  };

  return (
    <div>
      <div className="top-nav bg-gray-300 flex justify-between items-center px-2 py-1">
        <div className="flex items-center">
          <img
            className="h-10"
            src={require('assets/govt-uk.png')}
            alt="govt. logo"
          />
          <p className="mx-2 text-xl font-medium">
            GOVERNMENT OF UTTARAKHAND
            <span className="text-base"> - NATIONAL WEB PORTAL FOR JOBS</span>
          </p>
        </div>
        <div className="flex m-auto sm:m-0">
          <button className="mx-2" onClick={print} title="Print this page">
            <Icon name="print" />
          </button>
          <div id="google_translate_element"></div>
        </div>
      </div>

      <header className="bg-white flex items-end justify-between">
        <div className="logo flex items-end text-lg font-bold">
          <Link className="m-1" to="/">
            <img
              src={require('assets/awsar.png')}
              className="h-10"
              alt="Awsar Logo"
            />
          </Link>
          <Link to="/jobs" className="mx-3 text-blue-700 hover:text-blue-800">
            Jobs
          </Link>
          <Link
            to="/recommended"
            className="mx-3 text-blue-700 hover:text-blue-800">
            Recommended Jobs
          </Link>
          <Link to="/dashboard" className="text-blue-700 hover:text-blue-800">
            Dashboard
          </Link>
          <Link
            to="/courses"
            className="ml-3 text-blue-700 hover:text-blue-800">
            Courses
          </Link>
        </div>

        <input id="nav" type="checkbox" />
        <label htmlFor="nav" />
        <nav className="text-lg">
          <ul>
            <li>
              {user.username && user.role === 'Employer' ? (
                <Link
                  to="/createJob"
                  className="sm:mr-3 font-bold text-blue-600 hover:text-blue-700">
                  Post Job
                </Link>
              ) : null}
            </li>
            <li>
              <Link
                to="/news"
                className="sm:mr-3 font-bold text-blue-600 hover:text-blue-700">
                News
              </Link>
            </li>
            <li>
              {user.username ? (
                <button className="profile-button">
                  <span className="uppercase font-bold text-blue-600">
                    {user.username}
                  </span>
                  &nbsp;
                  <Icon style={{ display: 'inline' }} name="down-arrow" />
                  <ul className="flex flex-col py-6 px-6">
                    <li className="text-sm hover:text-blue-600">
                      <Link
                        to={
                          user.role === 'Employee'
                            ? `/profile/${user.username}`
                            : `/org/${user.username}`
                        }>
                        Profile
                      </Link>
                    </li>
                    <li className="text-sm hover:text-blue-600">
                      <Link to="/updateProfile">Edit Profile</Link>
                    </li>
                    <li
                      className="text-sm hover:text-blue-600"
                      onClick={signOut}>
                      Sign Out
                    </li>
                  </ul>
                </button>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="sm:mr-3 font-bold text-blue-600 hover:text-blue-700">
                    SignUp
                  </Link>
                  <Link
                    to="/login"
                    className="sm:mr-3 font-bold text-blue-600 hover:text-blue-700">
                    Login
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
