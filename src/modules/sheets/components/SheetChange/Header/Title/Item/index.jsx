import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { TableCell, TableRow, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

import Control from './Control';
import { useScroll } from '_hooks/';

const Item = memo(({ data, headerId, titleId }) => {
	//#region Data
	const marks = useSelector((state) => state.mark.marks, shallowEqual);
	const changes = useSelector((state) => state.mark.changes, shallowEqual);

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

	const [elRef, executeScroll] = useScroll();

	useEffect(() => {
		if (elRef.current && elRef.current?.id) {
			const _id = elRef.current.id;
			_id.includes(changes[0]) && executeScroll();
		}
	}, [data, changes]);

	//#region Render
	return (
		<TableRow
			ref={elRef}
			id={changes.includes(Number(data.id)) ? `${data.id}-changed` : ''}
			sx={{ backgroundColor: changes.includes(Number(data.id)) && '#FFDE2562!important' }}
		>
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
