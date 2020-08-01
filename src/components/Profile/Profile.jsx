import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

import { getProfile } from 'api';

import Icon from 'components/Icon';

function Profile({ user }) {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    setError(null);
    const data = await getProfile(username, 'Employee');
    if (data.error) setError(data.error.detail);
    else setUserData(data);
    setLoading(false);
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  if (error)
    return (
      <div className="text-center m-auto text-xl font-bold">
        {error === 'Not found.' && username === user.username ? (
          <p>
            Profile doesn't exist! <br />{' '}
            <Link className="text-blue-600 hover:underline" to="/createProfile">
              Click here
            </Link>{' '}
            to create your profile.
          </p>
        ) : (
          'Profile not found!'
        )}
      </div>
    );

  if (!userData || loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <div className="container mx-auto my-4 px-2">
      <div className="flex flex-wrap mx-2">
        <div className="w-full sm:w-1/3 sm:px-2">
          <div className="relative shadow rounded bg-white p-4">
            <div
              className="rounded-t h-24 bg-blue-500"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                zIndex: 1,
              }}></div>
            <div
              className="relative z-10 m-auto flex border-solid border-4 border-gray-600 rounded-full"
              style={{ width: 'fit-content' }}>
              <img
                src={userData.image}
                alt="user-profile"
                className="h-40 w-40 z-10 border-solid border-2 border-white m-auto rounded-full"
              />
            </div>
            <h1 className="mt-2 text-center text-blue-600 text-3xl font-bold">{`${userData.first_name} ${userData.last_name}`}</h1>
            <table className="table-fixed m-auto">
              <tbody>
                <tr>
                  <td className="px-4 font-bold">Gender</td>
                  <td className="px-4">{userData.gender}</td>
                </tr>
                {userData.dob && (
                  <>
                    <tr>
                      <td className="px-4 font-bold">DOB</td>
                      <td className="px-4">
                        {new Date(userData.dob).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 font-bold">Age</td>
                      <td className="px-4">
                        {Math.floor(
                          (new Date() - new Date(userData.dob)) / 31536000000,
                        )}{' '}
                        years
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="px-4 font-bold">Title</td>
                  <td className="px-4">{userData.title}</td>
                </tr>
                <tr>
                  <td className="px-4 font-bold">Industry</td>
                  <td className="px-4">{userData.industry}</td>
                </tr>
                <tr>
                  <td className="px-4 font-bold">Phone</td>
                  <td className="px-4">
                    <a
                      href={`tel:${userData.phone_number}`}
                      className="block text-blue-500">
                      {userData.phone_number}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 font-bold">Email</td>
                  <td className="px-4">
                    <a
                      href={`mailto:${userData.email}`}
                      className="block text-blue-500">
                      {userData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 font-bold">Location</td>
                  <td className="px-4">{userData.location}</td>
                </tr>
              </tbody>
            </table>
            {(userData.linkedin ||
              userData.twitter ||
              userData.resume ||
              userData.github) && (
              <div>
                <p className="font-medium text-center text-xl mt-2 text-blue-600">
                  Social Links
                </p>
                <div className="m-1 flex justify-center items-center">
                  {userData.linkedin && (
                    <a
                      href={userData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-1">
                      <Icon name="linkedin" />
                    </a>
                  )}
                  {userData.github && (
                    <a
                      href={userData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-1">
                      <Icon name="github" />
                    </a>
                  )}
                  {userData.twitter && (
                    <a
                      href={userData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-1">
                      <Icon name="twitter-2" />
                    </a>
                  )}
                  {userData.portfolio && (
                    <a
                      href={userData.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-1">
                      <Icon name="website" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full my-4 sm:my-0 sm:w-2/3 sm:px-2">
          <div className="shadow rounded bg-white py-4 px-6">
            <div className="mb-3">
              <p className="text-xl font-medium text-blue-600">About</p>
              <p>{userData.about}</p>
            </div>
            <div className="mb-3">
              <p className="font-medium text-xl mt-2 text-blue-600">Skills</p>
              <div className="mt-1">
                {userData.skills.split(',').map((skill) => (
                  <button
                    key={skill}
                    className="text-sm mr-2 bg-transparent text-indigo-700 font-semibold px-2 border border-indigo-500 rounded">
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xl font-medium text-blue-600">
                Education Qualification
              </p>
              {userData.education.map((ed, i) => (
                <div
                  key={i}
                  className="my-2 shadow-sm border border-indigo-400 rounded p-2 mb-2">
                  <p className="text-lg font-medium">
                    <span className="font-bold text-gray-800">
                      {ed.institution}
                    </span>{' '}
                    - {ed.degree}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ed.start_date} - {ed.end_date}
                  </p>
                </div>
              ))}
            </div>
            {userData.workexperience.length && (
              <div className="mb-4">
                <p className="text-xl font-medium text-blue-600">
                  Work Experience
                </p>
                {userData.workexperience.map((we, i) => (
                  <div
                    key={i}
                    className="my-2 shadow-sm border border-indigo-400 rounded p-2 mb-2">
                    <p className="text-lg font-medium">
                      <span className="font-bold text-gray-800">
                        {we.company}
                      </span>
                      , {we.location} - {we.position}
                    </p>
                    <p className="text-sm text-gray-600">
                      {we.start_date} - {we.end_date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
