"use client";

import { useEffect, useState } from "react";
import SubmissionForm from "./SubmissionForm";
import { useSearchParams, useRouter } from "next/navigation";

export default function AssessmentModal() {
  const search = useSearchParams();
  const router = useRouter();
  const open = search.get("modal") === "assessment";
  const [visible, setVisible] = useState(open);

  useEffect(() => setVisible(open), [open]);

  if (!visible) return null;

  function close() {
    setVisible(false);
    const params = new URLSearchParams(search.toString());
    params.delete("modal");
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[--border] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Free Assessment</h3>
          <button className="btn-secondary" onClick={close}>Close</button>
        </div>
        <div className="mt-4">
          <SubmissionForm type="ASSESSMENT" />
        </div>
      </div>
    </div>
  );
}


