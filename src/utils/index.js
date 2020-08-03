export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeDuplicate = (arr) =>
  arr.reduce(function (a, b) {
    if (a.indexOf(b) < 0) a.push(b);
    return a;
  }, []);

export const getDomains = () => [
  'Medical',
  'Engineering',
  'Law',
  'Sales',
  'Hotel Management',
  'Nurse',
  'Pharmacy',
  'Health Care Services',
  'Transport',
  'Dental',
  'Aviation',
  'IT',
  'Teacher Training',
  'Administrative',
  'Finance',
  'Sports Quota',
  'Architecture',
  'ITI / Diploma',
  'Arts',
  'Agriculture',
  'Naval',
  'Human Resources and Development',
  'Marketing',
  'Accounts',
  'Telecom',
  'Communication',
  'Travel and Tourism',
  'Bank',
  'Other',
];

export const getQualifications = () => [
  '8th',
  '10th',
  'Intermediate (10+2)',
  'B.Sc',
  'B.Pharm',
  'Diploma',
  'BDS',
  'B.Ed',
  'DMLT',
  'BUMS',
  'B.V.Sc',
  'GNM',
  'ITI',
  'M.Tech',
  'B.Tech',
  'M.Sc',
  'MBA',
  'MS / MD',
  'PGDM',
  'MCA',
  'B.A',
  'M.A',
  'GATE',
  'ANM',
];

export const getEmailTemplate = (status, candidateName, companyName, title) => {
  const templates = [
    {
      name: 'Shortlisted',
      template: `Hi ${candidateName},
  I would like to confirm your interview for the ${title} position. At this meeting, we’ll have the chance to [e.g. discuss your assignment] and get to know you a bit better. Below are the details of your interview:
  Keep in mind that you’ll need your ID, as the security guard will ask for it at the front desk. If you plan to drive, there is a parking lot next to our office that you may use.  
  Feel free to contact me via email, if you have any questions.
  I look forward to meeting with you and discussing this job opportunity at ${companyName}.`,
    },
    {
      name: 'Rejected',
      template: `Hi ${candidateName},
  Thank you for taking the time to consider ${companyName}. Our hiring team reviewed your application and we’d like to inform you that we are not able to advance you to the next round for the [Job_title] position at this time [it’s best to explain why, e.g. as we are looking with someone more experience in X.]
  We encourage you to apply again in the future, if you find an open role at our company that suits you.
  Thank you again for applying to ${companyName} and we wish you all the best in your job search.`,
    },
    {
      name: 'Selected',
      template: `Hi ${candidateName},
      With reference to your application and subsequent interviews with us, we are pleased to offer you a position in our Company as a ${title} on the terms and conditions as have been mutually agreed upon.
      Feel free to contact me via email, if you have any questions.
      You are required to join your duties on time.
      Looking forward to work with you`,
    },
    {
      name: 'Ineligible',
      template: `Hi ${candidateName},
  Thank you for taking the time to consider ${companyName}. We wanted to let you know that we have chosen to move forward with a different candidate for the ${title} position.
  Our team reviewed your application and came to the conclusion that your profile doesn't meet our eligibility criteria. [It’s best to include something that specifically drew your attention.] We think you could be a good fit for other future openings and will reach out again if we find a good match.
  We wish you all the best in your job search and future professional endeavors.
  Regards`,
    },
    {
      name: 'Selected for Interview',
      template: `Hi ${candidateName},
      Thanks for applying to ${companyName} organization.
      We reviewed your qualifications for the ${title} position and we wish to extend an invitation for an online interview.
      You will be meeting with a recruiter from our company. The interview should last approximately one hour and we’ll be using the time to further discuss your background, details about your experience, and information about our company.
      The Interview details has been shared with you by a Google Meet invite.      
      We are look forward to hearing from you!`,
    },
  ];

  return templates.filter((t) => t.name === status);
};
