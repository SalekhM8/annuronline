"use client";

import { useState, createContext, useContext } from "react";
import { X } from "lucide-react";

const ModalCloseContext = createContext<() => void>(() => {});
/** Children of a Modal can call this to close it (e.g. after a successful save). */
export function useModalClose() {
  return useContext(ModalCloseContext);
}

/** Self-contained trigger button + dialog overlay. */
export default function Modal({
  trigger,
  triggerClassName = "btn btn-primary",
  title,
  children,
}: {
  trigger: React.ReactNode;
  triggerClassName?: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {trigger}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="card w-full max-w-2xl p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg">{title}</h2>
              <button
                type="button"
                aria-label="Close"
                className="btn btn-ghost !p-2"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ModalCloseContext.Provider value={() => setOpen(false)}>
              {children}
            </ModalCloseContext.Provider>
          </div>
        </div>
      )}
    </>
  );
}
