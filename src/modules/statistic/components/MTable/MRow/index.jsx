import React from 'react';

import { Link, TableCell, TableRow } from '@mui/material';

import './index.scss';

const MRow = ({ data, index, previewClass }) => {
	//#region Data
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableRow className='statistic-row'>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center' sx={{ fontWeight: 600 }}>
				<Link
					underline='hover'
					sx={{ cursor: 'pointer' }}
					onClick={previewClass(data?.class)}
				>
					{data?.class?.name}
				</Link>
			</TableCell>
			<TableCell align='center' className='border-right'>
				{data.count}
			</TableCell>
			<TableCell align='center'>{data.perfect}</TableCell>
			<TableCell align='center'>{data.well}</TableCell>
			<TableCell align='center'>{data.good}</TableCell>
			<TableCell align='center'>{data.medium}</TableCell>
			<TableCell align='center'>{data.low}</TableCell>
			<TableCell align='center'>{data.bad}</TableCell>
			<TableCell align='center'>{data.underated}</TableCell>
		</TableRow>
	);

	//#endregion
};

MRow.displayName = MRow;

export default MRow;
