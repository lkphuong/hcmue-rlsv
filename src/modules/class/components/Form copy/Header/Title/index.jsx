import React, { memo, useEffect } from 'react';

import { Divider, Grid, Typography } from '@mui/material';

import { ITEMS_DEMO_1 } from '_modules/home/mocks';

import Item from './Item';

const Title = memo(({ data, index }) => {
	//#region Data

	// const [items, setItems] = useState([]);

	//#endregion

	//#region Event
	// const getItems = useCallback(async () => {
	// 	if (!data?.id) return;

	// 	try {
	// 		const res = await getItems(data.id);

	// 		if (isSuccess(res)) setItems(res.data);
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }, [data]);

	// const onChange = (item_id) => (e) => {
	// 	let value = 0;
	// 	value = Number(e.target.value);
	// 	if (isNaN(value)) value = 0;

	// 	console.log(value);

	// };

	//#endregion

	// useEffect(() => {
	// 	getItems();
	// }, [getItems]);

	//#region Render
	return (
		<>
			<Grid container alignItems='center' spacing={1.2}>
				<Grid item xs={6.4}>
					<Typography
						fontWeight={500}
						fontStyle='oblique'
						sx={{ textDecoration: 'underline' }}
					>
						{data.name}
					</Typography>
				</Grid>

				{index === 1 &&
					ITEMS_DEMO_1.length > 0 &&
					ITEMS_DEMO_1.map((e, i) => <Item key={i} data={e} />)}
			</Grid>
			<Divider sx={{ my: 2 }} />
		</>
	);
	//#endregion
});

Title.displayName = Title;

export default Title;
