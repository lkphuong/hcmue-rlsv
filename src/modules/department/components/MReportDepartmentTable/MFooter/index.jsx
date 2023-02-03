import { TableCell, TableFooter, TableRow } from '@mui/material';

const MFooter = ({ data }) => {
	//#region Data

	// 	return data?.reduce(
	// 		(prev, cur) => ({
	// 			total: prev.total + cur.count,
	// 			perfect: prev.perfect + cur.perfect,
	// 			well: prev.well + cur.well,
	// 			good: prev.good + cur.good,
	// 			medium: prev.medium + cur.medium,
	// 			low: prev.low + cur.low,
	// 			bad: prev.bad + cur.bad,
	// 			underated: prev.underated + cur.underated,
	// 		}),
	// 		{
	// 			perfect: 0,
	// 			well: 0,
	// 			good: 0,
	// 			medium: 0,
	// 			low: 0,
	// 			bad: 0,
	// 			underated: 0,
	// 			total: 0,
	// 		}
	// 	);
	// }, [data]);
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
						(e?.count / data?.sum_of_std_in_classes) *
						100
					).toFixed(2)}%`}</TableCell>
				))}
			</TableRow>
		</TableFooter>
	);
	//#endregion
};

export default MFooter;
