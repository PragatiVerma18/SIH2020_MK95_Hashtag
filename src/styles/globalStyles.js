import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: proximaNova;
    src: url(./assets/fonts/ProximaNovaRegular.ttf);
  }
  body {
    top: 0 !important;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    font-family: proximaNova, sans-serif;
  }
  body.modal-open {
    height: 100vh;
    overflow-y: hidden;
  }
  .App {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ececec;
  }
  button {
    &:focus {
      outline: none;
    }
    &.BrainhubCarousel__arrows {
      background-color: #4299e1 !important;
    }
  }
  .loader {
    width: 110px;
    margin: auto;
  }
  .carousel-root {
    padding-bottom: 6px;
    border-bottom: 1px solid #c1c1c1;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .thumb {
    border: 3px solid #2b6bb0 !important;
    &:hover {
      border: 3px solid #727272 !important;
    }
    &.selected {
      border: 3px solid #727272 !important;
    }
  }
  .thumbs {
    display: flex;
    justify-content: center;
  }
`;
