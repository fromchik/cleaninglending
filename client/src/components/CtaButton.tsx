import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type CtaButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function CtaButton({ children, className = "", ...props }: CtaButtonProps) {
  return (
    <button
      className={`inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold leading-5 text-ink shadow-card transition hover:bg-[#f0cf57] focus:outline-none focus:ring-4 focus:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
