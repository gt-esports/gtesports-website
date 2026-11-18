import type { ComponentPropsWithoutRef } from "react";
import { FiLock } from "react-icons/fi";

export default function ReadOnlyField(
  props: Omit<ComponentPropsWithoutRef<"input">, "className" | "readOnly">
) {
  return (
    <span className="relative mt-2 block">
      <input
        {...props}
        readOnly
        className="w-full rounded-lg border border-white/10 bg-white/[0.06] py-2.5 pl-3 pr-10 text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold"
      />
      <FiLock
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </span>
  );
}
