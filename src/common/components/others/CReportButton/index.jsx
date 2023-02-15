import { Button } from '@mui/material';

import { ReactComponent as Word } from '_assets/icons/word.svg';
import { ReactComponent as Excel } from '_assets/icons/excel.svg';

export const CReportButton = ({ onClick, type, disabled, ...props }) => {
	return (
		<Button
			variant='contained'
			color={type}
			disabled={disabled}
			endIcon={type === 'word' ? <Word /> : <Excel />}
			onClick={onClick}
			{...props}
		>
			{type === 'word' ? 'Xuất biên bản' : 'Xuất thống kê'}
		</Button>
	);
};
