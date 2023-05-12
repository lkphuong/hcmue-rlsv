import { useState } from 'react';

import { Button, Stack } from '@mui/material';

import { CInput } from '_controls/';

export const MSearch = ({ onFilterChange }) => {
	//#region Data
	const [currentInput, setCurrentInput] = useState('');
	//#endregion

	//#region Event
	const onChange = (e) => setCurrentInput(e.target.value);

	const updateFilter = () =>
		onFilterChange((prev) => ({ ...prev, input: currentInput, page: 1 }));
	//#endregion

	//#region Render
	return (
		<Stack spacing={1.5} alignItems='center' direction='row'>
			<CInput
				isSearch
				value={currentInput}
				onChange={onChange}
				placeholder='Nhập tên để tìm kiếm'
			/>

			<Button variant='contained' onClick={updateFilter}>
				Tìm kiếm
			</Button>
		</Stack>
	);
	//#endregion
};
