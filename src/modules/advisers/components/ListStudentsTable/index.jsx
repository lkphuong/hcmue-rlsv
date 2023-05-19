import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

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

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

import { approveAll } from '_api/sheets.api';

import { ERRORS } from '_constants/messages';

import { CLoadingSpinner } from '_others/';

import { Row } from './Row';

export const ListStudentsTable = ({
	data,
	refetch,
	isSelectedAll,
	selected,
	except,
	onSelect,
	loading,
	academic_id,
	semester_id,
	department_id,
	saveFilter,
	class_id,
}) => {
	//#region Data
	const { pathname } = useLocation();

	const isHistory = useMemo(() => pathname.includes('history'), [pathname]);
	const isReport = useMemo(() => pathname.includes('report'), [pathname]);

	const isSelected = useMemo(
		() => selected && !!Object.values(selected).filter((s) => s).length,
		[selected]
	);
	//#endregion

	//#region Event
	const onApprovalAll = () => {
		alert.question({
			onConfirm: async () => {
				const include_ids = isSelectedAll ? [] : selected;

				const body = {
					include_ids,
					except_ids: except,
					all: isSelectedAll ? true : false,
					academic_id,
					semester_id,
					department_id,
					class_id,
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
		<>
			{!(isHistory || isReport) && (
				<Box textAlign='left' my={1}>
					<Button
						variant='contained'
						onClick={onApprovalAll}
						disabled={!isSelectedAll && selected?.length === 0}
					>
						Duyệt tất cả
					</Button>
				</Box>
			)}

			<TableContainer className='c-table'>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{!(isHistory || isReport) && (
								<TableCell width={50} align='center'>
									<Checkbox
										indeterminate={
											(isSelected && !isSelectedAll) || except?.length > 0
										}
										onChange={onSelect(-1)}
										checked={isSelectedAll || isSelected}
										sx={{
											'& .MuiSvgIcon-root': {
												color: 'white',
											},
										}}
									/>
								</TableCell>
							)}
							<TableCell align='center'>STT</TableCell>
							<TableCell align='center'>Họ và tên</TableCell>
							<TableCell align='center'>Mã số sinh viên</TableCell>
							<TableCell align='center'>Điểm SV chấm</TableCell>
							<TableCell align='center'>Điểm lớp chấm</TableCell>
							<TableCell align='center'>Điểm CVHT chấm</TableCell>
							<TableCell align='center'>Điểm khoa chấm</TableCell>
							<TableCell align='center'>Xếp loại</TableCell>
							<TableCell align='center'>Trạng thái</TableCell>
							{!isReport && <TableCell />}
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan='100%' height={500}>
									<Box display='flex' alignItems='center' justifyContent='center'>
										<CLoadingSpinner />
									</Box>
								</TableCell>
							</TableRow>
						) : data?.length > 0 ? (
							data.map((row, index) => (
								<Row
									key={row.id}
									index={index + 1}
									data={row}
									onSelect={onSelect(Number(row.id))}
									isSelected={selected?.includes(Number(row.id)) || isSelectedAll}
									isRemoved={except?.includes(Number(row.id))}
									isHistory={isHistory}
									isReport={isReport}
									saveFilter={saveFilter}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan='100%'>
									<Box
										minHeight={300}
										display='flex'
										justifyContent='center'
										alignItems='center'
									>
										Không có dữ liệu hiển thị
									</Box>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
	//#endregion
};
