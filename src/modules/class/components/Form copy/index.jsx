import React from 'react';

import { Grid, Paper } from '@mui/material';

import { HEADERS } from '_modules/home/mocks';

import Header from './Header';

import './index.scss';

const Form = ({ formId }) => {
	//#region Data
	// const [headers, setHeaders] = useState([]);
	// //#endregion

	// //#region Event
	// const getHeaders = useCallback(async () => {
	// 	if (!formId) return;
	// 	try {
	// 		const res = await getHeaders(formId);

	// 		if (isSuccess(res)) setHeaders(res.data);
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }, [formId]);
	//#endregion

	// useEffect(() => {
	// 	getHeaders();
	// }, [getHeaders]);

	//#region Render
	return (
		<Paper>
			<Grid
				container
				borderRadius={1}
				overflow='hidden'
				sx={{ boxShadow: '0px 2px 2px 1px rgb(0 0 0 / 20%)' }}
			>
				<Grid
					item
					xl={1}
					textAlign='center'
					sx={{ backgroundColor: '#b9bec0', fontWeight: 600, py: 1.3 }}
				>
					Mục
				</Grid>
				<Grid
					item
					xl={11}
					sx={{ backgroundColor: '#b9bec0', fontWeight: 600, py: 1.3, px: '10px' }}
				>
					<Grid container spacing={1}>
						<Grid item xs={6.4}>
							Nội dung đánh giá
						</Grid>
						<Grid item xs={2} textAlign='center'>
							Khung điểm
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Sinh viên
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Lớp
						</Grid>
						<Grid item xs={1.2} textAlign='center'>
							Khoa
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid container mt={1.5} alignItems='stretch' className='grid-fake-table'>
				{HEADERS.length > 0 &&
					HEADERS.map((e, i) => (
						<Header key={i} headerId={'header_id'} data={e} index={i + 1} />
					))}
			</Grid>
		</Paper>
	);
	//#endregion
};
export default Form;
