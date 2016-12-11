import { keyframes } from 'styled-components';

export const getEffect = (from, to) => {
  return keyframes`
    from {
      ${from}
    }
    to {
      ${to}
    }
  `;
};
