import styled from 'styled-components';
import tw from 'twin.macro';

export const StyledContainer = styled.div.attrs({
  className: 'container mx-auto my-6 px-2',
})`
  div {
    &.cards-grid {
      ${tw`flex flex-wrap mx-2`}
      .left-card {
        ${tw`w-full my-4 sm:my-0 sm:w-1/4 sm:px-4`}
      }
      .right-card {
        ${tw`w-full my-4 sm:my-0 sm:w-3/4 sm:px-2`}
      }
      .grid-card {
        ${tw`shadow rounded bg-white py-4 px-6`}
      }
      .job {
        ${tw`relative cursor-pointer border border-blue-600 px-4 py-2 text-sm mb-4 hover:shadow-md`}
        border-left-width: 6px;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
        &.women-job {
          ${tw`border-pink-500`}
        }
        &.disabled-job {
          ${tw`border-green-600`}
        }
        .job-main {
          ${tw`text-base`}
          .title {
            ${tw`font-bold`}
          }
        }
        .job-desc {
          ${tw`mt-1 mb-1 text-gray-600`}
        }
      }
    }
    &.course {
      ${tw`inline-block w-full sm:w-1/3 md:w-1/4 p-3`}
      a {
        ${tw`inline-block text-gray-800 text-sm bg-white rounded shadow p-6`}
      }
      img {
        ${tw`mb-2 w-full`}
        height: 9rem;
      }
      .title {
        ${tw`text-center text-lg text-blue-600 font-bold hover:underline`}
      }
      span {
        font-weight: bold;
      }
      .instructor,
      .institute {
        ${tw`capitalize`}
      }
    }
    &.pagination {
      ${tw`flex justify-center items-center my-3`}
      span {
        ${tw`cursor-pointer transition duration-200 ease-in-out hover:bg-blue-700 mx-2 flex justify-center items-center h-10 w-10 text-white font-bold bg-blue-500 rounded-full`}
        &.current-page {
          ${tw`bg-blue-700 hover:bg-blue-800`}
        }
      }
      button {
        ${tw`mx-2 bg-blue-600 hover:bg-blue-800 border border-blue-600`}
      }
    }
  }
  h1 {
    ${tw`text-3xl font-bold text-center m-2 text-blue-700`}
  }
  a {
    &.news-item {
      ${tw`relative block m-4 bg-white p-6 rounded shadow`}
      .news-title {
        ${tw`font-bold text-lg text-gray-800 hover:underline`}
      }
      .news-description {
        ${tw`mt-1 sm:mb-2 text-sm`}
      }
      .source,
      .author {
        ${tw`text-sm text-gray-700`}
        span {
          font-weight: bold;
        }
      }
      .publishedAt {
        ${tw`mt-1 flex justify-between text-sm`}
      }
    }
  }
  input,
  textarea {
    ${tw`focus:outline-none focus:shadow-outline m-1 border border-gray-300 rounded py-2 px-4 leading-normal border-gray-400`}
  }
  button {
    ${tw`my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200`}
    &:disabled {
      ${tw`hover:bg-blue-500 opacity-50 cursor-not-allowed`}
    }
    &.apply-button {
      @media (min-width: 640px) {
        top: 4px;
        right: 10px;
      }
    }
    &.women-job {
      ${tw`text-xs bg-white mt-1 mr-2 rounded-sm text-white px-1 py-0 text-pink-600 border border-pink-600`}
    }
    &.disabled-job {
      ${tw`text-xs bg-white mt-1 rounded-sm text-white px-1 py-0 text-green-600 border border-green-600`}
    }
    &.general {
      ${tw`text-xs bg-white mt-1 rounded-sm text-white px-1 py-0 text-blue-600 border border-blue-600`}
    }
    &.clear-filters {
      ${tw`w-full block mt-2 py-1 text-white font-medium bg-gray-700 border border-gray-400 rounded`}
    }
  }
  select {
    ${tw`my-1 w-full block bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-2 border-gray-400`}
  }
  table {
    ${tw`rounded shadow-lg w-full table-auto`}
    th,
    td {
      ${tw`text-center px-4 py-4`}
      a {
        ${tw`text-blue-600 hover:underline`}
      }
    }
    td {
      ${tw`text-gray-700`}
      span {
        &.status {
          ${tw`inline-flex justify-center cursor-pointer text-sm font-bold py-1 px-4 rounded-full`}
          width: 94px;
        }
        &.Applied {
          ${tw`text-blue-600 bg-blue-200`}
        }
        &.Shortlisted {
          ${tw`text-purple-600 bg-purple-200`}
        }
        &.Selected {
          ${tw`px-2 text-green-600 bg-green-200`}
        }
        &.Ineligible {
          ${tw`text-orange-500 bg-orange-200`}
        }
        &.Rejected {
          ${tw`text-red-600 bg-red-200`}
        }
        &.Withdrawn {
          ${tw`text-gray-600 bg-gray-200`}
        }
        &.change-status {
          ${tw`text-xs cursor-pointer hover:underline text-blue-600`}
        }
      }
    }
    thead {
      ${tw`text-white bg-gray-700 shadow`}
    }
    tbody {
      ${tw`bg-white`}
    }
  }
`;
