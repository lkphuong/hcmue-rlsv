import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
	Box,
	Button,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import { approveAll } from '_api/sheets.api';

import { ERRORS } from '_constants/messages';

import { alert } from '_func/alert';
import { isSuccess } from '_func/';

import Row from './Row';

const ListStudents = ({ data, refetch, isSelectedAll, selected, onSelect, saveFilter }) => {
	//#region Data
	const isSelected = useMemo(
		() => selected && !!Object.values(selected).filter((s) => s).length,
		[selected]
	);

	const { class_id } = useParams();
	//#endregion

	//#region Event
	const onApprovalAll = () => {
		alert.question({
			onConfirm: async () => {
				const include_ids = isSelectedAll ? [] : selected;

				const body = {
					include_ids,
					all: isSelectedAll ? true : false,
				};

				const res = await approveAll(body);

				if (isSuccess(res)) {
					refetch();

					alert.success({ text: 'Duyệt phiếu cho các sinh viên thành công.' });
				} else {
					alert.fail({ text: res?.message || ERRORS.FAIL });
				}
			},
			title: 'Duyệt tất cả',
			text: 'Bạn có chắc chắn muốn duyệt cho tất cả phiếu đã chọn?',
		});
	};
	//#endregion

	//#region Render
	return (
		<Box>
			<Box textAlign='left' my={1}>
				<Button variant='contained' onClick={onApprovalAll}>
					Duyệt tất cả
				</Button>
			</Box>

			<TableContainer className='c-table'>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell width={50} align='center'>
								<Checkbox
									indeterminate={isSelected && !isSelectedAll}
									onChange={onSelect(-1)}
									checked={isSelectedAll || isSelected}
								/>
							</TableCell>
							<TableCell align='center'>STT</TableCell>
							<TableCell align='center'>Họ và tên</TableCell>
							<TableCell align='center'>Mã số sinh viên</TableCell>
							<TableCell align='center'>Điểm SV chấm</TableCell>
							<TableCell align='center'>Điểm lớp chấm</TableCell>
							<TableCell align='center'>Điểm khoa chấm</TableCell>
							<TableCell align='center'>Xếp loại</TableCell>
							<TableCell align='center'>Trạng thái</TableCell>
							<TableCell width={50} />
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length > 0 &&
							data.map((row, index) => (
								<Row
									key={row.id}
									index={index}
									data={row}
									classId={class_id}
									onSelect={onSelect(Number(row.id))}
									isSelected={selected?.includes(Number(row.id)) || isSelectedAll}
									saveFilter={saveFilter}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
	//#endregion
};

export default ListStudents;
