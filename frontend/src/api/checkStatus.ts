export const checkStatus = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/auth";
    return;
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.description || "Request failed");
  }
};
