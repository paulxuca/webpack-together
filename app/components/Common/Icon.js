import React from 'react';

const Icon = ({ type, ...otherProps }) => <span className={`ti-${type}`} {...otherProps} />;
export default Icon;