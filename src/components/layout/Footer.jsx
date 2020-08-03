import React from 'react';
import { Link } from 'react-router-dom';

import Icon from 'components/Icon';

import './styles/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="main-footer">
        <div className="my-2">
          <div className="flex mb-1">
            <Link to="/">
              <img
                src={require('assets/govt-uk.png')}
                className="awsar-logo"
                alt="uttarakhand government logo"
              />
            </Link>
            <Link to="/">
              <img
                src={require('assets/emblem.svg')}
                alt="website-logo"
                className="footer-logo"
              />
            </Link>
          </div>
          <div className="flex">
            <Link to="/">
              <Icon name="instagram" />
            </Link>

            <Link to="/">
              <Icon name="facebook" />
            </Link>

            <Link to="/">
              <Icon name="twitter" />
            </Link>
          </div>
        </div>
        <div className="footer-links">
          <Link to="/">Find Organization</Link>
          <Link to="/analytics">Job Analytics</Link>
          <Link to="/createJob">Post Job</Link>
          <Link to="/news">News</Link>
        </div>
      </div>
      <div className="copyright-bar bg-blue-600">
        <h6 className="text-sm">@2020 Team Hashtag. All Rights Reserved.</h6>
        <div>
          <Link to="/">Contact us</Link>
          <Link to="/">Provide feedback</Link>
          <Link to="/jobs">Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
