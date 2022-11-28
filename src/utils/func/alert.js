import Swal from 'sweetalert2';

export const alert = {
	success: ({ title, text } = {}) => {
		Swal.fire({
			title: title || 'Thành công',
			text,
			icon: 'success',
			customClass: {
				container: 'my-swal',
			},
		});
	},
	fail: ({ title, text } = {}) => {
		Swal.fire({
			title: title || 'Thất bại',
			text,
			icon: 'error',
			customClass: {
				container: 'my-swal',
			},
		});
	},
	loading: () => {
		Swal.fire({
			title: 'Đang xử lý',
			allowEnterKey: false,
			allowOutsideClick: false,
			showConfirmButton: false,
			willOpen: () => {
				Swal.showLoading();
			},
		});
	},
};
