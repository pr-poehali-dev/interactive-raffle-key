import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast-item toast-${t.type} flex items-center gap-3 cursor-pointer`}
          onClick={() => removeToast(t.id)}
        >
          {t.emoji && <span className="text-lg flex-shrink-0">{t.emoji}</span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
