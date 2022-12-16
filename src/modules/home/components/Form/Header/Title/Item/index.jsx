import React, { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { TableCell, TableRow, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

// import { FileModal } from './FileModal';
import Control from './Control';

const Item = memo(({ data, headerId, titleId, index }) => {
	//#region Data
	const available = useSelector((state) => state.mark.available, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const dispatch = useDispatch();

	// const fileRef = useRef();
	//#endregion

	//#region Event
	// const openModal = () => fileRef.current.open();
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
				<Typography ml={2}>- {data.content}</Typography>
			</TableCell>

			<Control
				id={Number(data.id)}
				min={data.from_mark}
				max={data.to_mark}
				mark={data.mark}
				control={data.control}
				category={data.category}
				unit={data.unit}
				options={data.options || []}
				required={data.required}
				titleId={titleId}
				index={index}
				available={available}
			/>
		</TableRow>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
