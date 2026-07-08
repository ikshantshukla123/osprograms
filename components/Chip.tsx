"use client";

export default function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-all active:scale-95 ${
        active
          ? "bg-gray-900 text-white ring-gray-900"
          : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-400"
      }`}
    >
      {children}
    </button>
  );
}
