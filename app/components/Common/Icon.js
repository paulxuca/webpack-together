import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.default.span`
  font-size: ${props => props.size || 'inherit'};
`;

const Icon = ({ type, size, ...otherProps }) => <IconContainer size={size} className={`ti-${type}`} {...otherProps} />;
export default Icon;