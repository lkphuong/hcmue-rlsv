import React, { useMemo } from 'react';

import { TableCell, TableFooter, TableRow } from '@mui/material';

const MFooter = ({ data }) => {
	//#region Data

	const summary = useMemo(() => {
		return data.reduce(
			(prev, cur) => ({
				total: prev.total + cur.count,
				perfect: prev.perfect + cur.perfect,
				well: prev.well + cur.well,
				good: prev.good + cur.good,
				medium: prev.medium + cur.medium,
				low: prev.low + cur.low,
				bad: prev.bad + cur.bad,
				underated: prev.underated + cur.underated,
			}),
			{
				perfect: 0,
				well: 0,
				good: 0,
				medium: 0,
				low: 0,
				bad: 0,
				underated: 0,
				total: 0,
			}
		);
	}, [data]);
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<TableFooter sx={{ position: 'sticky', bottom: 0 }}>
			<TableRow>
				<TableCell
					colSpan={3}
					align='center'
					className='border-right'
					sx={{ backgroundColor: 'rgb(243, 244, 246)!important' }}
				>
					Tổng cộng
				</TableCell>
				<TableCell align='center'>{summary.perfect}</TableCell>
				<TableCell align='center'>{summary.well}</TableCell>
				<TableCell align='center'>{summary.good}</TableCell>
				<TableCell align='center'>{summary.medium}</TableCell>
				<TableCell align='center'>{summary.low}</TableCell>
				<TableCell align='center'>{summary.bad}</TableCell>
				<TableCell align='center'>{summary.underated}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={3}
					align='center'
					className='border-right'
					sx={{ backgroundColor: 'rgb(243, 244, 246)!important' }}
				>
					Tỷ lệ phần trăm %
				</TableCell>
				<TableCell align='center'>{(summary.perfect / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.well / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.good / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.medium / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.low / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.bad / summary.total) * 100}%</TableCell>
				<TableCell align='center'>{(summary.underated / summary.total) * 100}%</TableCell>
			</TableRow>
		</TableFooter>
	);
	//#endregion
};

export default MFooter;
