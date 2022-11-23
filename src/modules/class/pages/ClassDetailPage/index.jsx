import React, { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { FORM_BY_ID as FORM } from '_modules/class/mocks';

import { Form } from '_modules/class/components';

import { getSheetById } from '_api/sheets.api';

import { isSuccess } from '_func/';

// function useBlocker(blocker, when = true) {
// 	const { navigator } = React.useContext(NavigationContext);

// 	React.useEffect(() => {
// 		if (!when) return;

//     navigator.block()

// 		const unblock = navigator.block((tx) => {
// 			const autoUnblockingTx = {
// 				...tx,
// 				retry() {
// 					unblock();
// 					tx.retry();
// 				},
// 			};

// 			blocker(autoUnblockingTx);
// 		});

// 		return unblock;
// 	}, [navigator, blocker, when]);
// }

// function usePrompt(message, when = true) {
// 	const blocker = React.useCallback(
// 		(tx) => {
// 			if (window.confirm(message)) tx.retry();
// 		},
// 		[message]
// 	);

// 	useBlocker(blocker, when);
// }

const ClassDetailPage = () => {
	//#region Data
	const { sheet_id } = useParams();

	const [data, setData] = useState(null);
	//#endregion

	//#region Event
	const getForm = useCallback(async () => {
		if (!sheet_id) return;
		try {
			const res = await getSheetById(sheet_id);

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		}
	}, [sheet_id]);
	//#endregion

	useEffect(() => {
		getForm();
	}, [getForm]);

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={1}
				p={2}
				mt={2}
				fontWeight={700}
				fontSize={20}
				sx={{ backgroundColor: 'rgba(0 0 0 / 15%)' }}
			>
				{`${FORM.user.fullname} - Niên khóa ${FORM.user.std_code}`}
			</Typography>

			<Box mt={1}>{data && <Form data={data} />}</Box>
		</Box>
	);
	//#endregion
};

export default ClassDetailPage;
