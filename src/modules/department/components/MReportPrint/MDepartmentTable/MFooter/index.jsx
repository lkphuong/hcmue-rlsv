import { TableCell, TableFooter, TableRow } from '@mui/material';

const MFooter = ({ data }) => {
	//#region Data
	//#endregion

	//#region Event

	//#endregion

	//#region Render
	return (
		<TableFooter sx={{ position: 'sticky', bottom: 0 }}>
			<TableRow>
				<TableCell
					colSpan={3}
					align='center'
					className='border-right'
					sx={{ backgroundColor: 'rgb(243, 244, 246)!important' }}
				>
					Tổng cộng
				</TableCell>
				{data?.sum_of_levels?.map((e) => (
					<TableCell key={e.id} align='center'>
						{e?.count}
					</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={3}
					align='center'
					className='border-right'
					sx={{ backgroundColor: 'rgb(243, 244, 246)!important' }}
				>
					Tỷ lệ phần trăm %
				</TableCell>
				{data?.sum_of_levels?.map((e) => (
					<TableCell key={e.id} align='center'>{`${(
						(e?.count / data?.sum_of_std_in_departments) *
						100
					).toFixed(2)}%`}</TableCell>
				))}
			</TableRow>
		</TableFooter>
	);
	//#endregion
};

export default MFooter;
