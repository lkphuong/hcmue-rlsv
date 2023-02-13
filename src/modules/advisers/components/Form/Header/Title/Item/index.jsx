import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';

import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { Folder } from '@mui/icons-material';

import { AdviserMarksContext } from '_modules/advisers/pages/AdviserDetailPage';

import { actions } from '_slices/mark.slice';

import { CFilePreviewModal } from '_others/';

import Control from './Control';

const Item = memo(({ data, headerId, titleId }) => {
	//#region Data
	const fileRef = useRef();

	const available = useSelector((state) => state.mark.available, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const { itemsMark } = useContext(AdviserMarksContext);

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
					<Button
						variant='contained'
						sx={{ p: 0, minWidth: '45px' }}
						endIcon={<Folder />}
						onClick={openModal}
					>
						{itemsMark[indexMark]?.files?.length ?? 0}
					</Button>
				)}
			</TableCell>

			<TableCell sx={{ display: 'none' }}>
				<Controller
					name={`title_${titleId}_${data?.id}.header_id`}
					defaultValue={headerId}
					render={({ field }) => <input type='hidden' {...field} />}
				/>
				<Controller
					name={`title_${titleId}_${data?.id}.item_id`}
					defaultValue={Number(data?.id)}
					render={({ field }) => <input type='hidden' {...field} />}
				/>
			</TableCell>

			<Control data={data} id={Number(data.id)} titleId={titleId} available={available} />

			<CFilePreviewModal ref={fileRef} itemData={itemsMark[indexMark]} />
		</TableRow>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
