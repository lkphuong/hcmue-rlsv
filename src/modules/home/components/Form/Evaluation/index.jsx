import React, { memo } from 'react';

const Evaluation = memo(({ data }) => {
	console.log(data);
	return <div>Evaluation</div>;
});
Evaluation.displayName = Evaluation;

export default Evaluation;
