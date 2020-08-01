import styled from 'styled-components';
import tw from 'twin.macro';

export const StyledForm = styled.main.attrs({
  className:
    'relative shadow-md rounded-lg py-12 bg-white mx-auto my-6 flex justify-center flex-col items-center',
})`
  & {
    width: ${({ width }) => width};
    &.create-job,
    &.update-job {
      ${tw`w-5/6 px-8`}
      @media (max-width:600px) {
        input,
        select {
          width: 100%;
        }
      }
      @media (min-width: 740px) {
        width: 640px;
        .qual,
        .last_date {
          width: 237px;
        }
      }
    }
    div {
      &.input-group {
        ${tw`my-1`}
        input {
          width: 300px;
        }
        label {
          span {
            ${tw`text-red-600`}
          }
        }
        .file-upload {
          ${tw`cursor-pointer text-center focus:outline-none focus:shadow-outline m-1 block border border-gray-300 rounded py-2 px-4 appearance-none leading-normal border-gray-400`}
        }
        @media (max-width: 600px) {
          input,
          select,
          textarea {
            width: 280px;
          }
        }
      }
      &.education,
      .work {
        ${tw`relative shadow-sm text-gray-600 border border-gray-400 rounded p-2 text-sm mb-2`}
        width: 624px;
        span {
          position: absolute;
          right: 10px;
          top: 5px;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          width: 280px;
        }
      }
    }
    span {
      &.required {
        ${tw`text-red-600`}
      }
    }
    h1 {
      ${tw`text-3xl font-bold text-center m-2 text-blue-700`}
    }
    form {
      ${tw`flex flex-col justify-center`}
    }
    label {
      ${tw`mx-1 text-gray-600 font-medium`}
    }
    input,
    textarea {
      ${tw`focus:outline-none focus:shadow-outline m-1 block border border-gray-300 rounded py-2 px-4 leading-normal border-gray-400`}
    }
    select {
      ${tw`block bg-white focus:outline-none focus:shadow-outline m-1 border border-gray-300 rounded py-2 px-4 leading-tight border-gray-400`}
    }
    button {
      ${tw`my-2 mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded transition ease-in duration-200`}
      &:disabled {
        ${tw`hover:bg-blue-500 opacity-50 cursor-not-allowed`}
      }
      &.selected {
        ${tw`bg-white text-blue-500 border border-blue-500`}
      }
    }
    p {
      &.error {
        ${tw`text-red-600`}
      }
    }
    a {
      ${tw`text-blue-400 font-bold`}
    }
  }
`;
