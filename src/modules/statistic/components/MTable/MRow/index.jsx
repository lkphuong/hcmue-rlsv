import React, { useMemo } from 'react';

import { Link, TableCell, TableRow } from '@mui/material';

import './index.scss';

const MRow = ({ data, index, previewClass }) => {
	//#region Data
	const count = useMemo(() => {
		if (!data?.levels?.length) return 0;

		return data.levels.reduce((prev, cur) => prev + cur?.count, 0);
	}, []);
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
					{data?.name}
				</Link>
			</TableCell>
			<TableCell align='center' className='border-right'>
				{count}
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
