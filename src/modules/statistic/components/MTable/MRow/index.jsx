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
					onClick={previewClass(data?.id, data?.name)}
				>
					{data?.name}
				</Link>
			</TableCell>
			<TableCell align='center' className='border-right'>
				{data?.num_of_std}
			</TableCell>
			{data?.levels?.length > 0 &&
				data.levels.map((level) => (
					<TableCell key={level.id} align='center'>
						{level.count}
					</TableCell>
				))}
		</TableRow>
	);

	//#endregion
};

MRow.displayName = MRow;

export default MRow;
