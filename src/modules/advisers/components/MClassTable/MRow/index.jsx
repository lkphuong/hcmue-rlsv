import { TableCell, TableRow } from '@mui/material';

import { CLink } from '_controls/';

import './index.scss';

const MRow = ({ data, index, onSetCurrent }) => {
	//#region Data
	//#endregion

	//#region Event
	const onClick = () => onSetCurrent({ classData: data });
	//#endregion

	//#region Render
	return (
		<TableRow className='statistic-row'>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center' sx={{ fontWeight: 600 }}>
				<CLink underline='hover' to={`${data?.id}`} onClick={onClick}>
					{data?.name + ' - ' + data?.code}
				</CLink>
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
