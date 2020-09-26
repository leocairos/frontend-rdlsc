import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 40px;
`;

export const Content = styled.div`
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  background: #efefef;

  height: auto;
  position: relative;

  img {
    padding: 40px;
  }

  .createAccount {
    margin-bottom: 40px;
  }

  form {
    width: 340px;

    button {
      color: #ffffff;
      background: #f49933;
      margin-bottom: 10px;
      font-size: 22px;

      &:hover {
        background-color: #e6810d;
      }
    }

    a {
      color: #183f73;
      text-align: right;
      padding-top: 10px;
    }
  }

  a {
    margin-top: 30px;
    color: #000;
  }
`;

const appearFromLeft = keyframes`
  from{
    opacity:0;
    transform: translateX(-50px);
  }
  to{
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin-top: 80px;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #000;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;
    }
  }

  > a {
    color: #000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }
  }
`;
