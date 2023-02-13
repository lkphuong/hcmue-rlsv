import { memo } from 'react';

import { TableCell, TableRow, Typography } from '@mui/material';

import { intToRoman } from '_func/';

import Title from './Title';

const Header = memo(({ data, index }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<>
			<TableRow>
				<TableCell align='center'>
					<Typography textTransform='uppercase' fontWeight={600}>
						{intToRoman(index)}
					</Typography>
				</TableCell>
				<TableCell colSpan='100%'>
					<Typography textTransform='uppercase' fontWeight={600} fontSize={18}>
						{data?.name}
						<Typography component='span' fontWeight={600} textTransform='none'>
							&nbsp;(Tối đa {data?.max_mark} điểm)
						</Typography>
					</Typography>
				</TableCell>
			</TableRow>

			{data?.titles?.length > 0 &&
				data.titles.map((e, i) => <Title key={i} data={e} index={i} />)}
		</>
	);
	//#endregion
});

Header.displayName = Header;

export default Header;
