import { forwardRef, useState, useImperativeHandle } from 'react';

import { Box, Grow, Modal, Paper } from '@mui/material';
import { CUpload } from '_controls/';

export const FileModal = forwardRef(({ props }, ref) => {
	//#region Data
	const [open, setOpen] = useState(false);
	//#endregion

	//#region Event
	const close = () => setOpen(false);
	//#endregion

	useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
	}));

	//#region Render
	return (
		<Modal open={open} onClose={close}>
			<Grow in={open} timeout={400}>
				<Box className='center' borderRadius={3}>
					<Paper>
						<Box p={4} minWidth={330}>
							<CUpload />
						</Box>
					</Paper>
				</Box>
			</Grow>
		</Modal>
	);
	//#endregion
});

FileModal.displayName = FileModal;
