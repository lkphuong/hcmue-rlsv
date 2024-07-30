import { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { Folder } from '@mui/icons-material';

import { StudentMarksContext } from '_modules/home/pages/StudentDetailPage';

import { actions } from '_slices/mark.slice';

import { CFileModal } from '_others/';

import Control from './Control';

const Item = memo(({ data, headerId, titleId }) => {
	//#region Data
	const fileRef = useRef();

	const available = useSelector((state) => state.mark.available, shallowEqual);
	const marks = useSelector((state) => state.mark.marks, shallowEqual);

	const { itemsMark } = useContext(StudentMarksContext);

	const dispatch = useDispatch();

	const indexMark = useMemo(() => {
		if (!itemsMark?.length) return null;

		return itemsMark.findIndex((e) => e?.item?.id === data?.id);
	}, [itemsMark, data]);

	const { control } = useFormContext();

	const filesValue = useWatch({ control, name: `title_${titleId}_${data?.id}.files` });

	const { replace } = useFieldArray({
		control,
		name: `title_${titleId}_${data?.id}.files`,
	});

	useEffect(() => {
		if (itemsMark?.length > 0 && itemsMark[indexMark] && itemsMark[indexMark]?.files) {
			replace(itemsMark[indexMark]?.files?.map((e) => ({ ...e, file_id: Number(e.id) })));
		}
	}, [itemsMark, indexMark]);

	const countFiles = useMemo(() => {
		if (filesValue?.length > 0) {
			return filesValue.filter((e) => e?.deleted !== 1)?.length;
		}
		if (itemsMark[indexMark]?.files?.length > 0) {
			return itemsMark[indexMark].files?.length;
		}
		return 0;
	}, [itemsMark, indexMark, filesValue]);
	//#endregion

	//#region Event
	const openModal = () => fileRef.current.open();
	//#endregion

	useEffect(() => {
		if (marks?.length)
			dispatch(
				actions.updateHeaderId({ header_id: Number(headerId), item_id: Number(data.id) })
			);
	}, [marks.length]);

	//#region Render
	return (
		<TableRow>
			<TableCell />
			<TableCell>
				<Typography ml={2} className={data?.required ? 'required' : ''} fontSize='1rem'>
					- {data.content}
				</Typography>

				{data?.is_file && (
					<Controller
						name={`title_${titleId}_${data?.id}.files`}
						defaultValue={itemsMark[indexMark]?.files || []}
						render={({ field, fieldState: { error } }) => (
							<>
								<Button
									variant='contained'
									sx={{
										p: 0,
										mt: 0.6,
										ml: 2,
										minWidth: '45px',
										backgroundColor: !!error ? 'red' : '#124874',
									}}
									endIcon={<Folder />}
									onClick={openModal}
								>
									{countFiles}
								</Button>
								<input style={{ opacity: 0, userSelect: 'none' }} {...field} />
							</>
						)}
					/>
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
				<Controller
					name={`title_${titleId}_${data?.id}.is_file`}
					defaultValue={data?.is_file}
					render={({ field }) => <input type='hidden' {...field} />}
				/>
			</TableCell>

			<Control data={data} id={Number(data.id)} titleId={titleId} available={available} />

			<CFileModal
				ref={fileRef}
				name={`title_${titleId}_${data?.id}.files`}
				files={filesValue?.length > 0 ? filesValue : itemsMark[indexMark]?.files || []}
			/>
		</TableRow>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
