import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';

import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { ImageSearch } from '@mui/icons-material';

import { ClassMarksContext } from '_modules/class/pages/ClassDetailPage';

import { actions } from '_slices/mark.slice';

import { CFileModal } from '_others/';

import Control from './Control';

const Item = memo(({ data, headerId, titleId, index }) => {
	//#region Data
	const fileRef = useRef();

	const available = useSelector((state) => state.mark.available, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const { itemsMark } = useContext(ClassMarksContext);

	const dispatch = useDispatch();

	const indexMark = useMemo(() => {
		if (!itemsMark?.length) return null;

		return itemsMark.findIndex((e) => e?.item?.id === data?.id);
	}, [itemsMark, data]);
	//#endregion

	//#region Event
	const openModal = () => fileRef.current.open();
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

				{data?.is_file && (
					<Button size='small' endIcon={<ImageSearch />} onClick={openModal}>
						Minh chứng
					</Button>
				)}
			</TableCell>

			<TableCell sx={{ display: 'none' }}>
				<Controller
					name={`title_${titleId}.${index}.header_id`}
					defaultValue={headerId}
					render={({ field }) => <input type='hidden' {...field} />}
				/>
				<Controller
					name={`title_${titleId}.${index}.item_id`}
					defaultValue={Number(data?.id)}
					render={({ field }) => <input type='hidden' {...field} />}
				/>
			</TableCell>

			<Control
				data={data}
				id={Number(data.id)}
				titleId={titleId}
				index={index}
				available={available}
			/>

			<CFileModal
				ref={fileRef}
				name={`title_${titleId}.${index}.files`}
				itemData={itemsMark[indexMark]}
			/>
		</TableRow>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
