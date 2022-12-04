import React, { useEffect, useRef, useState } from 'react';

import {
	Box,
	CardHeader,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { getLevels } from '_api/level.api';

import { isSuccess, isEmpty } from '_func/';

import MRow from './MRow';
import MFooter from './MFooter';

const MTable = ({ data, onClick, departmentName }) => {
	//#region Data
	const [height, setHeight] = useState(0);

	const [levels, setLevels] = useState([]);

	const heightRef = useRef(null);

	//#endregion

	//#region Event
	const getLevelsColumns = async () => {
		const res = await getLevels();

		if (isSuccess(res)) setLevels(res.data);
		else if (isEmpty(res)) setLevels([]);
	};
	//#endregion

	useEffect(() => {
		setHeight(heightRef.current.clientHeight);
	});

	useEffect(() => {
		getLevelsColumns();
	}, []);

	//#region Render
	return (
		<Box>
			<CardHeader
				title={`Danh sách thống kê phiếu chấm điểm rèn luyện của khoa: ${departmentName}`}
			/>
			<TableContainer className='c-table'>
				<Table stickyHeader className='statistic-table'>
					<TableHead>
						<TableRow>
							<TableCell rowSpan={2} align='center'>
								STT
							</TableCell>
							<TableCell rowSpan={2} align='center'>
								Lớp
							</TableCell>
							<TableCell rowSpan={2} align='center' className='border-right'>
								Sĩ số
							</TableCell>
							<TableCell
								colSpan={7}
								align='center'
								className='border-left'
								ref={heightRef}
							>
								Xếp loại
							</TableCell>
						</TableRow>
						<TableRow>
							{levels.length > 0 &&
								levels.map((level) => (
									<TableCell
										key={level.id}
										align='center'
										width={100}
										className='border-left'
										sx={{ top: height + 1 }}
									>
										{level.name}
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 &&
							data.map((row, index) => (
								<MRow
									key={row.id}
									index={index}
									data={row}
									previewClass={onClick}
								/>
							))}
					</TableBody>

					<MFooter data={data} />
				</Table>
			</TableContainer>
		</Box>
	);
	//#endregion
};

export default MTable;
