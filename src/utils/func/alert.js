import Swal from "sweetalert2";

export const alert = {
  success: ({ title, text } = {}) => {
    Swal.fire({
      title: title || "Thành công",
      text,
      icon: "success",
      customClass: {
        container: "my-swal",
      },
    });
  },
  fail: ({ title, text } = {}) => {
    Swal.fire({
      title: title || "Thất bại",
      text: text ?? "Thao tác không thành công, vui lòng kiểm tra lại.",
      icon: "error",
      customClass: {
        container: "my-swal",
      },
    });
  },
  loading: () => {
    Swal.fire({
      title: "Đang cập nhật",
      allowEnterKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  },
};
