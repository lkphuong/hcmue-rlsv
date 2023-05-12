import { useCallback, useEffect, useContext, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
	UNSAFE_NavigationContext as NavigationContext,
	useLocation,
	useNavigate,
} from 'react-router-dom';

//#region Hook resolver for validation (react-fook-form & yup)
export const useResolver = (validationSchema) =>
	useCallback(
		async (data) => {
			try {
				const values = await validationSchema.validate(data, {
					abortEarly: false,
				});

				return {
					values,
					errors: {},
				};
			} catch (errors) {
				return {
					values: {},
					errors: errors.inner.reduce(
						(allErrors, currentError) => ({
							...allErrors,
							[currentError.path]: {
								type: currentError.type ?? 'validation',
								message: currentError.message,
							},
						}),
						{}
					),
				};
			}
		},
		[validationSchema]
	);
//#endregion

//#region Hook confirm before reload / navigate
export function useConfirmExit(confirmExit, when = true) {
	const { navigator } = useContext(NavigationContext);

	useEffect(() => {
		if (!when) return;

		const push = navigator.push;

		navigator.push = (...args) => {
			const result = confirmExit();

			if (result !== false) push(...args);
		};

		return () => {
			navigator.push = push;
		};
	}, [navigator, confirmExit, when]);
}

export function usePrompt(message, when = true, actionConfirm) {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		if (when) {
			// Khi reload
			window.onbeforeunload = function (e) {
				return message;
			};

			// Khi click nút Back
			window.onpopstate = function (e) {
				let r = window.confirm(message);

				if (r === true) {
					dispatch(actionConfirm);
					return message;
				} else {
					navigate(location.pathname, { state: null });
				}
			};

			// Hủy back
			// navigate(location.pathname, { state: null });
		}

		return () => {
			window.onbeforeunload = null;
		};
	}, [message, when]);

	const confirmExit = useCallback(() => {
		const confirm = window.confirm(message);

		if (confirm) dispatch(actionConfirm);

		return confirm;
	}, [message]);
	useConfirmExit(confirmExit, when);
}
//#endregion

//#region Hook focus error (react-hook-form)
export const useFocusError = (isSubmitting, errors, setFocus) => {
	useEffect(() => {
		if (isSubmitting) return;

		if (Object.keys(errors).length > 0) {
			const firstError = Object.keys(errors)[0];

			setFocus(firstError);
		}
	}, [isSubmitting, errors, setFocus]);
};
//#endregion

//#region Hook Element scroll into view
export const useScroll = () => {
	const elRef = useRef(null);
	const executeScroll = () => elRef.current.scrollIntoView();

	return [elRef, executeScroll];
};
//#endregion
