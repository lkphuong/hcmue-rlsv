export function isSuccess(response) {
  return response?.status?.toString()[0] === "2";
}
