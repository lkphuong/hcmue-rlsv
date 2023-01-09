import { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { TableCell, TableRow, Typography } from '@mui/material';

import { isSuccess, intToRoman } from '_func/';

import { getTitlesByHeaderId } from '_api/form.api';

import Title from './Title';

const Header = memo(({ data, index, sheetId }) => {
	//#region Data
	const [titles, setTitles] = useState([]);

	const navigate = useNavigate();
	//#endregion

	//#region Event
	const getTitles = useCallback(async () => {
		if (!data?.id) return navigate(-1);

		try {
			const res = await getTitlesByHeaderId(data.id);

			if (isSuccess(res)) setTitles(res.data);
		} catch (error) {
			throw error;
		}
	}, [data?.id, navigate]);
	//#endregion

	useEffect(() => {
		getTitles();
	}, [getTitles]);

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

			{titles.length > 0 &&
				titles.map((e, i) => (
					<Title key={i} data={e} sheetId={sheetId} index={i + 1} headerId={data.id} />
				))}
		</>
	);
	//#endregion
});

Header.displayName = Header;

export default Header;
