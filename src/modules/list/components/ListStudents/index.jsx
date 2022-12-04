import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
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

const ListStudents = ({ data, refetch }) => {
	//#region Data
	const { role_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const { class_id } = useParams();

	const [selected, setSelected] = React.useState([]);
	//#endregion

	//#region Event
	const onSelectAll = (event) => {
		if (event.target.checked) {
			const newSelected = data.map((n) => Number(n.id));
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const onSelect = (id) => (event) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const onApprovalAll = () => {
		alert.question({
			onConfirm: async () => {
				const res = await approveAll({ role_id, sheet_ids: [...selected] });

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
			<TableContainer className='c-table'>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell width={50} align='center'>
								<Checkbox
									onChange={onSelectAll}
									indeterminate={
										selected.length > 0 && selected.length < data.length
									}
									checked={selected.length === data.length}
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
									selected={selected.includes(Number(row.id))}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box textAlign='center' my={3}>
				<Button variant='contained' disabled={!selected.length} onClick={onApprovalAll}>
					Duyệt tất cả
				</Button>
			</Box>
		</Box>
	);
	//#endregion
};

export default ListStudents;
