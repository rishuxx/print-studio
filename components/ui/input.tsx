import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full rounded-xl border border-input bg-white text-ink",
  "placeholder:text-muted-foreground",
  "transition-[border-color,box-shadow] duration-200",
  "hover:border-violet/40",
  "focus-visible:border-violet focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/12",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/12",
].join(" ");

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldBase,
        "h-11 px-3.5 text-sm",
        "file:mr-3 file:rounded-md file:border-0 file:bg-violet-wash file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-violet-deep",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "min-h-24 px-3.5 py-3 text-sm resize-y", className)}
      {...props}
    />
  );
}

/** Native select styled to match — used where Radix Select would be overkill. */
function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          fieldBase,
          "h-11 appearance-none pl-3.5 pr-10 text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export { Input, Textarea, NativeSelect, fieldBase };
