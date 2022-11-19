import React, { memo } from 'react';

import RangePicker from 'react-range-picker';

import { string, func } from 'prop-types';

export const CRangePicker = memo(({ placeholderText, values, onChange }) => {
	return <RangePicker placeholderText={placeholderText} onDateSelected={onChange} />;
});

CRangePicker.displayName = CRangePicker;

CRangePicker.propTypes = {
	placeholderText: string,
	onChange: func,
};

CRangePicker.defaultProps = {
	placeholderText: 'Ngày bắt đầu - Ngày kết thúc',
};
