import { TableCell, TableRow } from '@mui/material';

import { ROUTES } from '_constants/routes';

import { CLink } from '_controls/';

import './index.scss';

const MRow = ({ data, index, department_info }) => {
	//#region Data
	const info = JSON.stringify(department_info);
	//#endregion

	//#region Event
	//#endregion

	//#region Render
	return (
		<TableRow className='statistic-row'>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center' sx={{ fontWeight: 600 }}>
				<CLink underline='hover' to={`${ROUTES.ADMIN.REPORT}/${data?.id}/${info}`}>
					{data?.name}
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
