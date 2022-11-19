const { createTheme } = require('@mui/material');

const BORDER_TABLE = '1px solid rgb(146 142 142)';

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 320,
			sm: 480,
			md: 768,
			lg: 1024,
			xl: 1536,
			xxl: 1680,
		},
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
	},
	components: {
		MuiTextField: {
			defaultProps: {
				autoComplete: 'off',
				autoCorrect: 'off',
			},
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						'& .MuiOutlinedInput-input': {
							padding: '9px 14px',
						},
					},
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				input: {
					'&.MuiOutlinedInput-input': {
						padding: '0!important',
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					fontSize: '0.95rem',
					lineHeight: '1.4em',
				},
				input: {
					height: 'unset',
				},
				inputAdornedStart: {
					paddingLeft: '0!important',
				},
				inputAdornedEnd: {
					paddingRight: '0!important',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					border: BORDER_TABLE,
				},
			},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					'& .MuiTableCell-root': {
						borderLeft: BORDER_TABLE,
					},
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					'& .MuiTableRow-root': {
						'& .MuiTableCell-root': {
							borderBottom: BORDER_TABLE + '!important',
							fontWeight: 600,
							backgroundColor: 'rgb(0 248 21 / 20%)',
						},
					},
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'& .MuiTableCell-root': {
						borderBottom: BORDER_TABLE,
					},
					'&:last-child': {
						'& .MuiTableCell-root': {
							borderBottom: 0,
						},
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					'&:first-of-type': {
						borderLeft: 0,
					},
				},
			},
		},
	},
});

export default theme;
