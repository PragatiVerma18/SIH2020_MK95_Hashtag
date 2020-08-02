import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';

const modalAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const StyledModal = styled.main.attrs({
  className: 'w-full h-full fixed flex justify-center items-center',
})`
  & {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    background: rgba(0, 0, 0, 0.6);
  }

  .content {
    ${tw`w-3/4 sm:w-1/3 relative p-8 rounded bg-white`}

    animation: ${modalAnimation} 0.25s;
  }

  .heading {
    ${tw`mb-2 uppercase tracking-wide m-auto font-bold text-center text-blue-600 text-xl sm:text-2xl`}
  }

  .close-icon {
    ${tw`cursor-pointer text-lg flex items-center justify-center transition ease-in duration-300 w-8 h-8 rounded bg-gray-700 hover:bg-gray-900 text-white font-bold absolute`}

    top: 10px;
    right: 10px;
  }

  label {
    ${tw`text-gray-600 font-medium`}
  }

  input,
  textarea {
    ${tw`w-full mt-1 mb-2 focus:outline-none focus:shadow-outline block border border-gray-300 rounded py-2 px-4 leading-normal border-gray-400`}
  }

  select {
    ${tw`w-full mt-1 mb-2 block bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 leading-tight border-gray-400`}
  }

  button {
    ${tw`w-full my-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded transition ease-in duration-200`}

    &:disabled {
      ${tw`hover:bg-blue-500 opacity-50 cursor-not-allowed`}
    }
  }
`;
