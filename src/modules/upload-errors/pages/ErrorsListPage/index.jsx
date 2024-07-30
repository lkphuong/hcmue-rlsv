import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getFileReports } from '_api/files.api';
import { MErrorsTable } from '_modules/upload-errors/components';

const ErrorsListPage = () => {
	//#region Data
	const [params, setParams] = useState({ page: 1 });

	const [pagination, setPagination] = useState({ page: 1, pages: 0 });

	const { data, isFetching } = useQuery({
		queryKey: ['errors-report', params],
		queryFn: () => getFileReports(params),
		select: (response) => response?.data,
	});

	const dataTable = useMemo(() => data?.data ?? [], [data]);
	//#endregion

	//#region Event
	const onPageChange = (event, newPage) => {
		setParams((prev) => ({ ...prev, page: newPage }));
	};
	//#endregion

	useEffect(() => {
		if (data) {
			setPagination({ page: data?.page ?? 1, pages: data?.pages ?? 0 });
		}
	}, [data]);

	//#region Render
	return (
		<MErrorsTable
			loading={isFetching}
			data={dataTable}
			page={pagination.page}
			pages={pagination.pages}
			onPageChange={onPageChange}
		/>
	);
	//#endregion
};
export default ErrorsListPage;
