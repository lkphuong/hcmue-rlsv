import { CTable } from '_others/';
import dayjs from 'dayjs';

export const MErrorsTable = ({ loading, data, page, pages, onPageChange }) => {
	const headers = [
		{ key: 'username', label: 'Username', width: 200 },
		{
			key: 'created_at',
			label: 'Thời điểm xảy ra lỗi',
			width: 240,
			cellRender: (value) => <>{dayjs(value).format('DD/MM/YYYY HH:mm:ss')}</>,
		},
		{ key: 'message', label: 'Nội dung lỗi', align: 'left' },
	];

	return (
		<CTable
			loading={loading}
			headers={headers}
			data={data}
			fontSizeBody={16}
			pagination={{ page, pages, onPageChange }}
		/>
	);
};
