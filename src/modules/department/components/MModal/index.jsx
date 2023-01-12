import { forwardRef, useImperativeHandle, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';

import { Box, Button, Grow, Modal, Paper, Stack, Typography } from '@mui/material';

import { useResolver } from '_hooks/';

import { CAutocomplete, CInput } from '_controls/';

import { initialValues, validationSchema, validationSchemaEdit } from '_modules/department/form';

import { createDepartmentAccount, updateDepartmentAccount } from '_api/others.api';

import { isSuccess } from '_func/';
import { alert } from '_func/alert';

export const MModal = forwardRef(({ refetch, editData }, ref) => {
	//#region Data
	const departments = useSelector((state) => state.options.departments, shallowEqual);

	const [open, setOpen] = useState(false);

	const resolver = useResolver(editData ? validationSchemaEdit : validationSchema);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: editData
			? {
					...editData,
					isEdit: true,
					department_id: editData.department.id,
			  }
			: { ...initialValues, department_id: departments[0].id },
		mode: 'all',
		shouldFocusError: true,
		resolver,
	});
	//#endregion

	//#region Event
	const close = () => {
		reset();
		setOpen(false);
	};

	const onSubmit = async (values) => {
		const res = editData
			? await updateDepartmentAccount(editData?.id, values)
			: await createDepartmentAccount(values);

		if (isSuccess(res)) {
			refetch();

			alert.success({
				text: editData
					? 'Cập nhật tài khoản khoa thành công.'
					: 'Thêm tài khoản khoa thành công.',
			});

			close();
		} else {
			alert.fail({ text: res?.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
		}
	};

	const onSelectChange = (CallbackFunc) => (option) => CallbackFunc(option?.id);
	//#endregion

	useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
	}));

	//#region Render
	return (
		<Modal open={open} onClose={close}>
			<Grow in={open} timeout={400}>
				<Paper className='center' sx={{ borderRadius: 3 }}>
					<Box p={4} minWidth={330}>
						<Typography fontSize={30} fontWeight={700} lineHeight='36px' mb={4}>
							{!!editData ? 'Chỉnh sửa tài khoản' : 'Thêm mới tài khoản khoa'}
						</Typography>

						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack direction='column' spacing={1} mb={3}>
								<Typography>Tên khoa</Typography>
								<Controller
									control={control}
									name='department_id'
									render={({
										field: { value, ref, name, onChange },
										fieldState: { error },
									}) => (
										<CAutocomplete
											disableClearable
											disabled={!!editData}
											display='name'
											name={name}
											value={value}
											onChange={onSelectChange(onChange)}
											ref={ref}
											options={departments}
											renderOption={(props, option) => (
												<Box component='li' {...props} key={option?.id}>
													{option?.name}
												</Box>
											)}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Stack>

							<Stack direction='column' spacing={1} mb={3}>
								<Typography>Tên đăng nhập</Typography>
								<Controller
									control={control}
									name='username'
									render={({
										field: { value, ref, name, onChange },
										fieldState: { error },
									}) => (
										<CInput
											name={name}
											value={value}
											onChange={onChange}
											ref={ref}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</Stack>

							{!editData && (
								<>
									<Stack direction='column' spacing={1} mb={3}>
										<Typography>Mật khẩu mới</Typography>
										<Controller
											control={control}
											name='password'
											render={({
												field: { value, ref, name, onChange },
												fieldState: { error },
											}) => (
												<CInput
													isPassword
													name={name}
													value={value}
													onChange={onChange}
													ref={ref}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Stack>

									<Stack direction='column' spacing={1} mb={3}>
										<Typography>Xác nhận mật khẩu</Typography>
										<Controller
											control={control}
											name='confirm_password'
											render={({
												field: { value, ref, name, onChange },
												fieldState: { error },
											}) => (
												<CInput
													isPassword
													name={name}
													value={value}
													onChange={onChange}
													ref={ref}
													error={!!error}
													helperText={error?.message}
												/>
											)}
										/>
									</Stack>
								</>
							)}

							<Box textAlign='center'>
								<Button variant='contained' type='submit'>
									{editData ? 'Cập nhật' : 'Thêm'}
								</Button>
							</Box>
						</form>
					</Box>
				</Paper>
			</Grow>
		</Modal>
	);
	//#endregion
});
