import React, { useState, useEffect, useCallback, useRef } from 'react';

import { courses } from 'utils/courses';
import { usePagination } from 'utils/customHooks/usePaginate';

import Icon from 'components/Icon';
import { StyledContainer } from 'components/StyledContainer';

function Courses() {
  const [loading, setLoading] = useState(true);
  const { next, prev, currentData, currentPage, maxPage } = usePagination(
    courses.edges,
    52,
  );

  let filteredCourses = useRef([]);
  filteredCourses.current = currentData();

  const onTextChange = ({ target: { value } }) => {
    if (value.length > 0) {
      const coursesArray = currentData().filter(({ node: n }) =>
        n.title.includes(value),
      );
      filteredCourses.current = coursesArray;
    } else filteredCourses.current = currentData();
  };

  const setCourses = useCallback(() => {
    filteredCourses.current = currentData();
  }, [currentData]);

  useEffect(() => {
    setCourses();
  }, [setCourses]);

  useEffect(() => {
    const interval = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearInterval(interval);
    };
  }, [setLoading]);

  if (loading)
    return (
      <img className="loader" alt="loader" src={require('assets/loader.gif')} />
    );

  return (
    <StyledContainer>
      <h1>Recommended courses for Government Jobs</h1>
      <div className="mx-3 flex flex-col sm:flex-row justify-between items-end">
        <p className="mb-1 font-bold text-gray-800 text-sm">
          Total Results on this page: {filteredCourses.current.length} courses
        </p>
        <input
          type="text"
          style={{ width: 250 }}
          name="title"
          onChange={onTextChange}
          placeholder="Search by title..."
        />
      </div>
      <div>
        {filteredCourses.current.length ? (
          filteredCourses.current.map(({ node: n }) => (
            <div className="course" key={n.id}>
              <a
                href={`https://swayam.gov.in/${n.url}`}
                target="_blank"
                rel="noopener noreferrer">
                <img src={n.coursePictureUrl} alt={n.title} />
                <p className="title">
                  {n.title.substring(0, 20)}
                  {n.title.length > 20 ? '...' : ''}
                </p>
                <p className="instructor">
                  <span>Instructor:</span>{' '}
                  {n.explorerInstructorName.substring(0, 15)}
                  {n.explorerInstructorName > 15 ? '...' : ''}
                </p>
                <p className="institute">
                  <span>Institute:</span>{' '}
                  {n.instructorInstitute.substring(0, 45)}
                </p>
                {n.category[0] && n.category[0].name && (
                  <p className="category">
                    <span>Category:</span> {n.category[0].name.substring(0, 15)}
                  </p>
                )}
                <p>
                  <span>Duration:</span> {n.weeks} weeks
                </p>
                <p className="font-bold mt-1 text-center text-gray-800 text-xs">
                  ({`From ${n.startDate.substring(0, 10)}`}
                  {n.endDate && <span> to {n.endDate.substring(0, 10)}</span>})
                </p>
              </a>
            </div>
          ))
        ) : (
          <p className="text-2xl font-bold text-center">No Courses found!</p>
        )}
      </div>
      <div className="pagination">
        {currentPage !== 1 && (
          <>
            <button onClick={prev}>
              <Icon style={{ display: 'inline-block' }} name="chevron-left" />{' '}
              &nbsp;Prev
            </button>
            <span onClick={prev}>{currentPage - 1}</span>
          </>
        )}
        <span className="current-page">{currentPage}</span>
        {currentPage !== maxPage && (
          <>
            <span onClick={next}>{currentPage + 1}</span>
            <button onClick={next}>
              Next&nbsp;
              <Icon style={{ display: 'inline-block' }} name="chevron-right" />
            </button>
          </>
        )}
      </div>
    </StyledContainer>
  );
}

export default Courses;
