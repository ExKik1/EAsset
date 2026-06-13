import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface NotificationToastProps {
  messages: string[];
  type: "success" | "danger";
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  messages,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [messages, onClose]);

  if (messages.length === 0 || !messages[0]) return null;

  return (
    <div
      className={`fixed z-[9999] flex items-start gap-3 p-4 rounded-xl shadow-xl border-l-4 transition-all duration-300
      top-8 left-4 right-4 w-auto animate-fade-in-up
      md:top-5 md:left-auto md:right-5 md:w-[360px] md:max-w-sm
      ${
        type === "success"
          ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-emerald-900/10"
          : "bg-rose-50 border-rose-500 text-rose-900 shadow-rose-900/10"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1 opacity-75">
          {type === "success" ? "Success Notification" : "Error Notification"}
        </h4>

        {messages.length > 1 ? (
          <ul className="list-disc list-inside text-xs font-medium leading-relaxed opacity-90 space-y-1 block max-h-[150px] overflow-y-auto pr-1 break-words">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className="inline-block w-full text-justify md:text-left"
              >
                <span className="inline-block w-1.5 h-1.5 bg-current rounded-full mr-2 align-middle mb-0.5"></span>
                <span className="align-middle">{msg}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs font-medium leading-relaxed opacity-90 break-words text-justify md:text-left">
            {messages[0]}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-700 transition-colors ml-1 p-1 -mt-1 rounded hover:bg-black/5 shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
