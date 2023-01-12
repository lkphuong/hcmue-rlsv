import { SvgIcon } from '@mui/material';

import { ReactComponent as Edit } from '_assets/icons/edit.svg';
import { ReactComponent as Duplicate } from '_assets/icons/duplicate.svg';
import { ReactComponent as Delete } from '_assets/icons/delete.svg';
import { ReactComponent as Setting } from '_assets/icons/setting.svg';

export const CEditIcon = ({ ...props }) => {
	return <SvgIcon {...props} component={Edit} />;
};

export const CDuplicateIcon = ({ ...props }) => {
	return <SvgIcon {...props} component={Duplicate} />;
};

export const CDeleteIcon = ({ ...props }) => {
	return <SvgIcon {...props} component={Delete} />;
};

export const CSettingIcon = ({ ...props }) => {
	return <SvgIcon {...props} component={Setting} />;
};
