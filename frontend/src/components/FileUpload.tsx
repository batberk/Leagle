import { useState, useRef, type DragEvent } from "react";
import type { FileUploadProps } from "../types";
import { isValidPdf } from "../types";

export default function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleFile(file: File | undefined) {
    if (file && isValidPdf(file)) {
      onUpload(file);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          hidden
        />
        {isUploading ? (
          <p>Uploading...</p>
        ) : (
          <>
            <p className="upload-icon">&#128196;</p>
            <p>Drag & drop a PDF here, or click to select</p>
            <p className="upload-hint">Only PDF files are accepted</p>
          </>
        )}
      </div>
    </div>
  );
}
