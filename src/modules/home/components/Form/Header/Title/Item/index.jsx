import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Grid, Typography } from '@mui/material';

import { actions } from '_slices/mark.slice';

// import { FileModal } from './FileModal';
import Control from './Control';

const Item = memo(({ data, headerId }) => {
	//#region Data
	const dispatch = useDispatch();

	// const fileRef = useRef();
	//#endregion

	//#region Event
	// const openModal = () => fileRef.current.open();
	//#endregion

	useEffect(() => {
		dispatch(actions.updateHeaderId({ header_id: Number(headerId), item_id: Number(data.id) }));
	}, [data.id, headerId]);

	//#region Render
	return (
		<>
			<Grid item xs={6.4}>
				<Typography ml={2}>- {data.content}</Typography>

				{/* <Box mt={1} ml={1.5}>
					<Button
						variant='contained'
						size='small'
						endIcon={<FolderOpen />}
						sx={{ textTransform: 'none', backgroundColor: '#f7c12c', color: 'black' }}
						onClick={openModal}
					>
						Minh chứng
					</Button>
				</Box> */}
			</Grid>

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
				headerId={Number(headerId)}
			/>

			{/* <FileModal ref={fileRef} /> */}
		</>
	);
	//#endregion
});

Item.displayName = Item;

export default Item;
