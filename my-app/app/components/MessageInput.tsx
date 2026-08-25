import React, { useRef, useState } from "react";

function MessageInput({ send }: any) {
  const [inputValue, setInputValue] = useState<{
    text: string;
    file: File | null;
  }>({
    text: "",
    file: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    // Send current data first
    send(inputValue);

    // Clear text
    setInputValue({
      text: "",
      file: null,
    });

    // Clear actual file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="flex gap-4 items-center">
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) =>
          setInputValue((prev) => ({
            ...prev,
            file: e.target.files?.[0] ?? null,
          }))
        }
        className="p-2 border flex-1 bg-white border-gray-300 text-black rounded-lg"
      />

      <input
        value={inputValue.text}
        onChange={(e) =>
          setInputValue((prev) => ({ ...prev, text: e?.target?.value }))
        }
        type="text"
        className="p-2 border flex-1 bg-white border-gray-300 text-black rounded-lg"
      />
      <button
        type="button"
        onClick={handleSend}
        className="rounded-lg border p-2 cursor-pointer bg-amber-400 text-black"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
