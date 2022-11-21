import React, { memo } from 'react';

import { Checkbox, Grid } from '@mui/material';

const SubEvaluation = memo(({ data }) => {
	//#region Event

	//#endregion

	return (
		<>
			<Grid item xs={1}></Grid>

			{data?.children ? (
				<Grid item xs={11}>
					{data.content}
				</Grid>
			) : (
				<>
					<Grid item xs={7} display='flex' alignItems='center'>
						{data.content}
					</Grid>
					<Grid
						item
						xs={2}
						textAlign='center'
						display='flex'
						alignItems='center'
						justifyContent='center'
					>
						Điểm
					</Grid>
					<Grid item xs={2} textAlign='center'>
						<Checkbox />
					</Grid>
				</>
			)}

			{data?.evaluation?.length > 0 &&
				data.children &&
				data.evaluation.map((e, i) => <SubEvaluation key={i} data={e} />)}
		</>
	);
});

export default SubEvaluation;

// RENDER với đệ quy
// const renderDisplay = (_data) => {
// 	console.log('Gọi lại renderDisplay với data: ', _data);
// 	return (
// 		<>
// 			<Grid item xs={1}></Grid>

// 			<Grid item xs={11}>
// 				{_data.content}
// 			</Grid>

// 			{_data?.evaluation?.length > 0 &&
// 				_data.children &&
// 				_data.evaluation.map((e) => renderDisplay(e))}
// 		</>
// 	);
// };
