import { TableCell, TableRow } from '@mui/material';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { CLink } from '_controls/';

import { actions } from '_slices/currentInfo.slice';

import './index.scss';

const MRow = ({ data, index }) => {
	//#region Data
	const { semester, academic, department } = useSelector(
		(state) => state.currentInfo,
		shallowEqual
	);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const handleSetCurrent = () => {
		const info = {
			semester,
			academic,
			department,
			classData: data,
		};

		dispatch(actions.setInfo(info));
	};
	//#endregion

	//#region Render
	return (
		<TableRow className='statistic-row'>
			<TableCell align='center'>{index + 1}</TableCell>
			<TableCell align='center' sx={{ fontWeight: 600 }}>
				<CLink underline='hover' to={`${data?.id}`} onClick={handleSetCurrent}>
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
