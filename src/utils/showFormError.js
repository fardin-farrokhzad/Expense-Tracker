export function showFormError(setError, message) {
  setError(message);
  setTimeout(() => setError(''), 3000);
}
