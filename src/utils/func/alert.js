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
			customClass: {
				container: 'my-swal',
			},
			willOpen: () => {
				Swal.showLoading();
			},
		});
	},
	warning: ({ onConfirm, title, text } = {}) => {
		Swal.fire({
			title: title || 'Xác nhận?',
			text: text || 'Bạn chắc chắn muốn thay đổi?',
			showCancelButton: true,
			icon: 'warning',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Hủy bỏ',
			customClass: {
				container: 'my-swal',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				onConfirm();
			}
		});
	},
	warningDelete: ({ onConfirm } = {}) => {
		Swal.fire({
			title: 'Xóa?',
			text: 'Thao tác này sẽ không thể hoàn tác, bạn chắc chắn muốn xóa?',
			showCancelButton: true,
			icon: 'warning',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Hủy bỏ',
			customClass: {
				container: 'my-swal',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				onConfirm();
			}
		});
	},
	question: ({ onConfirm, title, text, ...props } = {}) => {
		Swal.fire({
			title: title || 'Xác nhận?',
			text: text || 'Bạn có muốn tạo ra 1 biểu mẫu mới tương tự?',
			showCancelButton: true,
			icon: 'question',
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Hủy bỏ',
			customClass: {
				container: 'my-swal',
			},
			...props,
		}).then((result) => {
			if (result.isConfirmed) {
				onConfirm();
			}
		});
	},
	confirmMark: ({ onConfirm, fullname, mark, level } = {}) => {
		Swal.fire({
			title: 'Cập nhật điểm thành công',
			html: `Tổng điểm của <b>${fullname}</b> là <b>${mark}</b> <br>Xếp loại <b>${level}</b>`,
			showCancelButton: true,
			icon: 'success',
			confirmButtonText: 'Xong',
			cancelButtonText: 'Điều chỉnh',
			customClass: {
				container: 'my-swal',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				onConfirm();
			}
		});
	},
};
