import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ProfileEditModal({
  isOpen,
  title,
  value,
  onSave,
  onClose,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h3 className="font-bold text-lg text-gray-800">
            Edit {title}
          </h3>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <label className="block text-sm text-gray-600 mb-2">
            {title}
          </label>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(inputValue)}
            className="px-5 py-2 rounded-xl bg-indigo-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}