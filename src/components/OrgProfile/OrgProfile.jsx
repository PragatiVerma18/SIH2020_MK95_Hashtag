import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

import { getProfile } from 'api';

import Icon from 'components/Icon';

function OrgProfile({ user }) {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    setError(null);
    const data = await getProfile(username, 'Employer');
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

  if (!localStorage.getItem('token')) return <Redirect to="/login" />;

  return (
    <div className="relative my-6 shadow rounded p-6 m-auto w-5/6 md:w-1/3 sm:w-1/2 bg-white">
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
      <p className="relative text-center uppercase text-3xl font-bold text-indigo-600">
        {userData.company_name}{' '}
        <span className="absolute" style={{ top: 7 }}>
          <Icon name="verified" width="18" height="18" />
        </span>
      </p>
      {userData.full_form && (
        <p className="text-center text-lg font-bold text-blue-500">
          {userData.full_form}
        </p>
      )}
      <div className="my-2">
        <table className="text-lg table-fixed m-auto">
          <tbody>
            <tr>
              <td className="px-4 py-1 font-bold">Industry</td>
              <td className="px-4 py-1 text-gray-800">{userData.industry}</td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-bold">Location</td>
              <td className="px-4 py-1 text-gray-800">{userData.location}</td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-bold">Email</td>
              <td className="px-4 py-1 text-gray-800">
                <a
                  href={`mailto:${userData.email}`}
                  className="block text-blue-500">
                  {userData.email}
                </a>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-bold">Org Size</td>
              <td className="px-4 py-1 text-gray-800">
                {userData.company_size}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-bold">Org type</td>
              <td className="px-4 py-1 text-gray-800">
                {userData.company_type}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-bold">Pan number</td>
              <td className="px-4 py-1 text-gray-800">{userData.pan}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col">
        <p className="m-auto mt-2 text-blue-600 text-xl">Important Links</p>
        <div className="flex justify-center">
          {userData.linkedin && (
            <a
              href={userData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1">
              <Icon name="linkedin" />
            </a>
          )}
          {userData.website && (
            <a
              href={userData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1">
              <Icon name="website" />
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
        </div>
      </div>
      <div>
        <p className="mt-2 text-blue-600 text-xl">Overview</p>
        <p className="text-gray-700">{userData.overview}</p>
      </div>
    </div>
  );
}

export default OrgProfile;
