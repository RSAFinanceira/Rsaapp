export function showNotification(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  const colors = {
    success: 'bg-[#22c55e]',
    warning: 'bg-amber-500',
    error: 'bg-red-500'
  };

  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}