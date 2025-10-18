// src/components/FileUpload.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, X, CheckCircle, Loader2, Camera, StopCircle } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default function FileUpload({ onUploadComplete, setLoading, setProgress }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [localProgress, setLocalProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const allowedExtensions = [".pdf", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg"];

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!allowedExtensions.some((ext) => selectedFile.name.toLowerCase().endsWith(ext))) {
      setError("Only PDF, Word, Excel, PNG, JPG files are allowed!");
      return;
    }
    setFile(selectedFile);
    setError("");
    setSuccess(false);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    if (!allowedExtensions.some((ext) => droppedFile.name.toLowerCase().endsWith(ext))) {
      setError("Only PDF, Word, Excel, PNG, JPG files are allowed!");
      return;
    }
    setFile(droppedFile);
    setError("");
    setSuccess(false);
    setPreview(URL.createObjectURL(droppedFile));
  };

  // Upload to backend
  const handleUpload = async () => {
    if (!file) {
      setError("Please select or capture a file first.");
      return;
    }

    setLoading?.(true);
    setProgress?.(0);
    setLocalProgress(0);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setLocalProgress(percent);
          setProgress?.(percent);
        },
      });

      const { results, analytics } = res.data || {};
      setSuccess(true);
      onUploadComplete?.(results || [], analytics || {}, file);
    } catch {
      setError("❌ Upload failed! Backend not responding or invalid file.");
    } finally {
      setLoading?.(false);
      setTimeout(() => {
        setProgress?.(0);
        setLocalProgress(0);
      }, 600);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setError("");
      setFile(null);
      setPreview(null);
    } catch {
      setError("⚠️ Camera access denied or not available.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const imageFile = new File([blob], "captured_image.png", { type: "image/png" });
      setFile(imageFile);
      setPreview(URL.createObjectURL(imageFile));
      stopCamera();
    });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setIsCameraActive(false);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload or Capture Document</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Upload your legal document or capture an image using your camera.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          📂 Upload File
          <input type="file" accept=".pdf,.docx,.xls,.xlsx,.png,.jpg,.jpeg" hidden onChange={handleFileChange} />
        </label>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          onClick={isCameraActive ? stopCamera : startCamera}
        >
          {isCameraActive ? <StopCircle className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          {isCameraActive ? "Stop Camera" : "Capture from Camera"}
        </button>
      </div>

      {/* Camera Preview */}
      {isCameraActive && (
        <div className="flex flex-col items-center mb-6">
          <video ref={videoRef} autoPlay className="rounded-lg border shadow-md mb-3 w-72 h-56" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <button
            onClick={capturePhoto}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            📸 Capture Photo
          </button>
        </div>
      )}

      {/* File Preview */}
      {preview && (
        <div className="mb-6 flex flex-col items-center">
          <img src={preview} alt="Preview" className="rounded-lg border shadow-md w-64 mb-2" />
          <X
            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-600"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setSuccess(false);
            }}
          />
        </div>
      )}

      {/* Drag-Drop */}
      {!file && !isCameraActive && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-400 rounded-2xl p-8 bg-gray-100 hover:border-gray-500 transition-all"
        >
          <UploadCloud className="w-10 h-10 mx-auto text-gray-500 mb-2" />
          <p className="text-gray-600 font-medium">Drag & drop a file here or use buttons above</p>
        </div>
      )}

      {/* Progress */}
      {localProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-3"
            style={{ width: `${localProgress}%`, transition: "width 0.3s" }}
          />
        </div>
      )}

      {/* Messages */}
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 mt-3 flex justify-center items-center gap-2 font-medium">
          <CheckCircle className="w-5 h-5" /> Upload successful!
        </p>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || localProgress > 0}
        className={`mt-6 w-full py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition ${
          !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {localProgress > 0 ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="w-5 h-5" /> Upload & Analyze
          </>
        )}
      </button>
    </div>
  );
}
