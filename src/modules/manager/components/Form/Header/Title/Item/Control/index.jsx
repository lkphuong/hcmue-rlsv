import { memo, useContext, useMemo } from 'react';

import { DepartmentMarksContext } from '_modules/manager/pages/SheetDetailPage';

import TypeInput from './TypeInput';
import TypeCheckbox from './TypeCheckbox';
import TypeSelect from './TypeSelect';

const Control = memo(
	({ id, min, max, mark, control, category, unit, options, required, headerId, available }) => {
		//#region Data
		const { status, itemsMark } = useContext(DepartmentMarksContext);

		const currentMark = useMemo(() => {
			if (!itemsMark?.length)
				return {
					personal_mark_level: 0,
					class_mark_level: 0,
					department_mark_level: 0,
				};

			const foundItem = itemsMark.find((e) => e.item.id?.toString() === id?.toString());

			if (!foundItem)
				return {
					personal_mark_level: 0,
					class_mark_level: 0,
					department_mark_level: 0,
				};

			return {
				personal_mark_level: foundItem.personal_mark_level,
				class_mark_level: foundItem.class_mark_level,
				department_mark_level: foundItem.department_mark_level,
			};
		}, [id, itemsMark]);

		const initialMark = useMemo(() => {
			if (status === 4) {
				return currentMark.personal_mark_level;
			}
			if (status < 4) {
				return currentMark.class_mark_level;
			} else {
				return currentMark.department_mark_level;
			}
		}, [
			currentMark.class_mark_level,
			currentMark.department_mark_level,
			currentMark.personal_mark_level,
			status,
		]);

		const renderControl = useMemo(() => {
			switch (control) {
				case 0:
					return (
						<TypeInput
							id={id}
							min={min}
							max={max}
							mark={mark}
							unit={unit}
							category={category}
							initialMark={initialMark}
							currentMark={currentMark}
							header_id={headerId}
							available={available}
						/>
					);
				case 1:
					return (
						<TypeCheckbox
							id={id}
							mark={mark}
							unit={unit}
							initialMark={initialMark}
							currentMark={currentMark}
							header_id={headerId}
							available={available}
						/>
					);
				case 2:
					return (
						<TypeSelect
							item_id={id}
							required={required}
							options={options}
							initialMark={initialMark}
							currentMark={currentMark}
							header_id={headerId}
							available={available}
						/>
					);
				default:
					break;
			}
		}, [control]);
		//#endregion

		//#region Event

		//#endregion

		//#region Render
		return <>{renderControl}</>;

		//#endregion
	}
);

export default Control;
