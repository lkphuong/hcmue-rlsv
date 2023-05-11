import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { TableCell, TableRow, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import Control from './Control';

const Item = memo(({ data, headerId, titleId }) => {
	//#region Data
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	//#endregion

	useEffect(() => {
		if (marks?.length) {
			dispatch(
				actions.updateHeaderId({ header_id: Number(headerId), item_id: Number(data.id) })
			);
		}
	}, [marks.length]);

	//#region Render
	return (
		<TableRow>
			<TableCell />
			<TableCell>
				<Typography ml={2} className={data?.required ? 'required' : ''} fontSize='1rem'>
					- {data.content}
				</Typography>
			</TableCell>

			<Control data={data} id={Number(data.id)} titleId={titleId} />
		</TableRow>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
