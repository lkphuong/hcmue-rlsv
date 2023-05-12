import { Zoom } from '@mui/material';

export default function componentStyleOverrides(theme) {
	const bgColor = theme.colors?.grey50;
	return {
		MuiTypography: {
			styleOverrides: {
				root: {
					'&.required': {
						'&::after': {
							content: "' *'",
							color: 'red',
						},
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					fontWeight: 600,
					borderRadius: '4px',
				},
			},
		},
		MuiButtonBase: {
			styleOverrides: {
				root: {
					'&.Mui-disabled': {
						'& .MuiAvatar-root': {
							color: 'rgba(0, 0, 0, 0.26)!important',
						},
					},
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				elevation: 3,
			},
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					'&.paper-wrapper': {
						backgroundColor: '#ffffff',
						color: '#124874',
						transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
						boxShadow: 'none',
						backgroundImage: 'none',
						borderRadius: '12px',
						overflow: 'hidden',
						// border: '1px solid',
						// borderColor: '#90caf975',
					},
					'&.paper-filter': {
						background: 'rgba(255, 255, 255, 0.33)',
						borderRadius: '12px',
						boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
						backdropFilter: 'blur(0.8px)',
						border: '1px solid rgba(255, 255, 255, 0.3)',
					},
				},
				rounded: {
					borderRadius: `12px`,
				},
			},
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					color: theme.colors?.textDark,
					padding: '24px',
				},
				title: {
					fontSize: '1.125rem',
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: '24px',
				},
			},
		},
		MuiCardActions: {
			styleOverrides: {
				root: {
					padding: '24px',
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					color: theme.darkTextPrimary,
					paddingTop: '10px',
					paddingBottom: '10px',
					'&.Mui-selected': {
						color: '#CF373D',
						backgroundColor: theme.menuSelectedBack,
						'&:hover': {
							backgroundColor: theme.menuSelectedBack,
						},
						'& .MuiListItemIcon-root': {
							color: '#CF373D',
						},
					},
					'&:hover': {
						backgroundColor: theme.menuSelectedBack,
						color: theme.menuSelected,
						'& .MuiListItemIcon-root': {
							color: theme.menuSelected,
						},
					},
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					color: theme.darkTextPrimary,
					minWidth: '36px',
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					color: theme.textDark,
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					color: theme.textDark,
					'&::placeholder': {
						color: theme.darkTextSecondary,
						fontSize: '0.875rem',
						opacity: 1,
					},
				},
			},
		},
		MuiOutlinedInput: {
			defaultProps: {
				autoComplete: 'off',
			},
			styleOverrides: {
				root: {
					background: bgColor,
					borderRadius: `12px`,
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.colors?.grey400,
					},
					'&:hover $notchedOutline': {
						borderColor: theme.colors?.primaryLight,
					},
					'&.MuiInputBase-multiline': {
						padding: 1,
					},
				},
				input: {
					fontWeight: 500,
					background: bgColor,
					padding: '15.5px 14px',
					borderRadius: `12px`,
					'&.MuiInputBase-inputSizeSmall': {
						padding: '10px 14px',
						'&.MuiInputBase-inputAdornedStart': {
							paddingLeft: 0,
						},
					},
				},
				inputAdornedStart: {
					paddingLeft: 4,
				},
				notchedOutline: {
					borderRadius: `12px`,
				},
			},
		},
		MuiSlider: {
			styleOverrides: {
				root: {
					'&.Mui-disabled': {
						color: theme.colors?.grey300,
					},
				},
				mark: {
					backgroundColor: theme.paper,
					width: '4px',
				},
				valueLabel: {
					color: theme?.colors?.primaryLight,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: theme.divider,
					opacity: 1,
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					color: theme.colors?.primaryDark,
					background: theme.colors?.primary200,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					'&.MuiChip-deletable .MuiChip-deleteIcon': {
						color: 'inherit',
					},
				},
			},
		},
		MuiTooltip: {
			defaultProps: {
				arrow: true,
				disableInteractive: true,
				TransitionComponent: Zoom,
			},
			styleOverrides: {
				tooltip: {
					color: theme.paper,
					background: theme.colors?.grey700,
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				paper: {
					marginTop: '0.2rem',
					boxShadow: '0 0 10px 6px rgb(0 0 0 / 14%)',
				},
				popper: {
					minWidth: '300px',
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontWeight: 600,
					'&.Mui-active': {
						fontSize: '1rem',
						fontWeight: 600,
					},
					'&.Mui-completed': {
						fontWeight: 600,
					},
				},
			},
		},
		MuiAccordion: {
			styleOverrides: {
				root: {
					'&::before': {
						height: 0,
					},
				},
			},
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					'&.Mui-expanded': {
						minHeight: '50px',
					},
				},
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					padding: '8px',
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					'& .MuiTableRow-root': {
						'& .MuiTableCell-root': {
							padding: '10px',
							backgroundColor: '#124874',
							textTransform: 'uppercase',
							fontWeight: 600,
							color: 'white',
						},
					},
				},
			},
		},
		MuiTableBody: {
			styleOverrides: {
				root: {
					backgroundColor: 'white',
					'& .MuiTableCell-root.sticky': {
						backgroundColor: 'white',
					},
				},
			},
		},
		MuiTableFooter: {
			styleOverrides: {
				root: {
					'& .MuiTableCell-root': {
						padding: '14px',
						fontSize: '1rem',
						color: '#124874',
						backgroundColor: 'white',
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					padding: '6px 10px',
					'& .MuiIconButton-root:not(.MuiAutocomplete-popupIndicator,.MuiAutocomplete-clearIndicator)':
						{
							borderRadius: '8px',
							fontSize: '1.25rem',
							color: 'transparent',
							'&:hover': {
								backgroundColor: 'rgb(208 206 244)',
							},
							'&.Mui-disabled': {
								color: 'transparent',
								'& path': {
									stroke: 'rgb(0 0 0 / 20%)',
								},
							},
						},
					'&.border-left': {
						borderLeft: '1px solid rgba(224, 224, 224, 1)',
					},
					'&.border-right': {
						borderRight: '1px solid rgba(224, 224, 224, 1)',
					},
					'&.sticky': {
						position: 'sticky',
						'&-right': {
							right: 0,
							boxShadow: '-2px 0px 10px 0px rgb(0 0 0 / 20%)',
						},
						'&-left': {
							left: 0,
							boxShadow: '2px 0px 10px 0px rgb(0 0 0 / 20%)',
						},
					},
				},
			},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					'&.statistic-table': {
						backgroundColor: 'rgb(243, 244, 246)',
						'& .MuiTableHead-root': {
							'& .MuiTableCell-root': {
								lineHeight: '1.1rem',
							},
						},
					},
				},
			},
		},
		MuiTableRow: {
			defaultProps: {
				hover: true,
			},
		},
		MuiTabs: {
			defaultProps: {
				selectionFollowsFocus: true,
			},
		},
		MuiModal: {
			styleOverrides: {
				backdrop: {
					backgroundColor: 'rgb(182 182 182 / 50%)',
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				standardSuccess: {
					backgroundColor: 'rgb(107 255 132 / 48%)',
					color: '#333333',
					'& .MuiAlert-icon': {
						color: '#00af31!important',
					},
				},
				standardError: {
					backgroundColor: 'rgb(255 173 173)',
					color: '#333333',
					'& .MuiAlert-icon': {
						color: '#990101!important',
					},
				},
				standardWarning: {
					backgroundColor: '#fff4e5',
					color: '#ad926b',
					'& .MuiAlert-icon': {
						color: '#ef7918!important',
					},
				},
			},
		},
	};
}
