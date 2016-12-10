import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.default.i`
  font-size: ${props => props.size || 'inherit'};
  color: ${props => props.color || 'default'};
  font-family: 'themify' !important;
`;

const Icon = ({ type, size, color, ...otherProps }) => <IconContainer size={size} color={color} className={`ti-${type}`} {...otherProps} />;
export default Icon;