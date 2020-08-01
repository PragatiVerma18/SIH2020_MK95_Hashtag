import { useState } from 'react';

export const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  //   function jump(page) {
  //     const pageNumber = Math.max(1, page);
  //     setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  //   }

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  return { next, prev, currentData, currentPage, maxPage };
};
