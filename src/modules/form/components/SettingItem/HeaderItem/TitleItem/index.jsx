import { AddCircleOutline, ExpandMore } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';

import { getItemsByTitleId } from '_api/form.api';
import { isEmpty, isSuccess } from '_func/';

import ItemDisplay from './ItemDisplay';
import ItemModal from './ItemModal';

const TitleItem = memo(({ data }) => {
	//#region Data
	const itemRef = useRef();

	const [items, setItems] = useState([]);

	const { id: title_id } = data;
	//#endregion

	//#region Event
	const getItems = async () => {
		if (!title_id) return;

		const res = await getItemsByTitleId(title_id);

		if (isSuccess(res)) setItems(res.data);
		else if (isEmpty) {
			setItems([]);
		}
	};

	const openModal = () => itemRef.current.open();
	//#endregion

	useEffect(() => {
		getItems();
	}, [data?.id]);

	//#region Render
	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Typography fontWeight={600}>- {data.name}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{items.length > 0 &&
					items.map((item) => (
						<ItemDisplay key={item.id} data={item} refetch={getItems} />
					))}

				<Grid item xs={12}>
					<Grid container alignItems='center' justifyContent='center' spacing={1}>
						<Grid item xs='auto'>
							<IconButton onClick={openModal}>
								<AddCircleOutline />
							</IconButton>
						</Grid>
						<Grid item xs>
							<Typography>Thêm chi tiết tiêu chí</Typography>
						</Grid>
					</Grid>
				</Grid>
			</AccordionDetails>

			<ItemModal ref={itemRef} refetch={getItems} title_id={Number(title_id)} />
		</Accordion>
	);

	//#endregion
});

export default TitleItem;
