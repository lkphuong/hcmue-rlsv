import React from 'react';

import { useRouteError } from 'react-router-dom';

export const CErrorPage = () => {
	const error = useRouteError();
	console.error(error);

	return (
		<div id='error-page'>
			<h1>Oops!</h1>
			<p>Rất tiếc, đã có lỗi xảy ra.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
};
