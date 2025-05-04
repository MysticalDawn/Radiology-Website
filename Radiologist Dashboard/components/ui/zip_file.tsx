// components/ZipFileInput.tsx
import { useRef } from "react";
import { Upload } from "lucide-react"; // Optional: Lucide icon set

export default function ZipFileInput({
  onFileSelect,
}: {
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/zip") {
      onFileSelect(file);
    } else {
      alert("Please select a valid .zip file.");
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer flex items-center text-center justify-center border-2 border-dashed border-gray-400 rounded-2xl p-5 m-1 text-center transition hover:border-blue-500 hover:bg-blue-500"
    >
      <div className="flex items-center space-x-2">
        <Upload className="text-white" />
        <p className="font-medium text-white">Click to upload the data</p>
      </div>
      <input
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
