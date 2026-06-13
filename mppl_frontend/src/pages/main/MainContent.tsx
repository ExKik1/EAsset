import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ShieldAlert, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";

import { TabNavigation } from "../../components/main/TabNavigation";
import { DropzoneInput } from "../../components/main/DropzoneInput";
import { PasswordInput } from "../../components/main/PasswordInput";
import { ProcessingStatus } from "../../components/main/ProcessingStatus";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function MainContent() {
  useDocumentTitle("Main Dashboard");
  const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const encryptionStages = [
    "Mengunggah berkas asal ke server...",
    "Menderivasi kunci 256-bit via scryptSync & dynamic salt...",
    "Membuat IV baru dan memproses stream AES-256-GCM...",
    "Menyematkan GCM Auth Tag di footer berkas...",
    "Mengunduh berkas terenkripsi (.locked) ke browser...",
  ];

  const decryptionStages = [
    "Mengunggah berkas terenkripsi...",
    "Membaca Header (Salt & IV) serta GCM Auth Tag secara efisien...",
    "Menderivasi kunci rahasia menggunakan password...",
    "Menyinkronkan Auth Tag & Membuka stream deskripsi...",
    "Mengunduh berkas asli yang telah dipulihkan...",
  ];

  const activeStages =
    activeTab === "encrypt" ? encryptionStages : decryptionStages;

  useEffect(() => {
    // Memastikan token aktif, jika tidak, tendang ke login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setSuccessMsg("");
    setErrorMsg("");
    if (activeTab === "decrypt") {
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (ext !== "locked" && ext !== "enc") {
        setErrorMsg(
          "Peringatan: Berkas tidak menggunakan ekstensi .locked atau .enc.",
        );
      }
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSuccessMsg("");
    setErrorMsg("");
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Kosong", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1)
      return { score, label: "Lemah", color: "bg-rose-500 w-1/4" };
    if (score === 2)
      return { score, label: "Sedang", color: "bg-amber-500 w-2/4" };
    if (score === 3)
      return { score, label: "Kuat", color: "bg-teal-500 w-3/4" };
    return { score, label: "Sangat Kuat", color: "bg-emerald-500 w-full" };
  };

  const strength = getPasswordStrength(password);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password) return;

    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    setCurrentStage(0);

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1100);

    const logPayload = {
      file_name: file.name,
      file_size: formatBytes(file.size),
      action_type: activeTab,
    };

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const endpoint =
        activeTab === "encrypt" ? "/api/encrypt" : "/api/decrypt";
      const token = localStorage.getItem("token");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Operasi kriptografi gagal.");
      }

      setCurrentStage(4);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const blob = await response.blob();
      const xFilename = response.headers.get("x-filename");

      let defaultFilename =
        activeTab === "encrypt"
          ? `${file.name}.locked`
          : `decrypted_${file.name.replace(/\.locked$/i, "")}`;
      if (xFilename) defaultFilename = decodeURIComponent(xFilename);

      if ("showSaveFilePicker" in window) {
        try {
          const ext = defaultFilename.split(".").pop() || "bin";
          const opts: any = {
            suggestedName: defaultFilename,
            types: [
              {
                description:
                  activeTab === "encrypt"
                    ? "Encrypted Locked File"
                    : "Decrypted File",
                accept: {
                  "application/octet-stream": [
                    activeTab === "encrypt" ? ".locked" : `.${ext}`,
                  ],
                },
              },
            ],
          };

          const handle = await (window as any).showSaveFilePicker(opts);
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
        } catch (pickerErr: any) {
          if (pickerErr.name === "AbortError") {
            setIsLoading(false);
            return;
          }
          throw pickerErr;
        }
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = defaultFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      setSuccessMsg(
        activeTab === "encrypt"
          ? `Berkas "${file.name}" berhasil dienkripsi.`
          : `Berkas "${file.name}" berhasil didekripsi.`,
      );

      if (token) {
        await api.post(
          "/logs",
          { ...logPayload, status: "success" },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      setFile(null);
      setPassword("");
    } catch (err: any) {
      clearInterval(stageInterval);
      setErrorMsg(err.message || "Gagal menghubungi server kriptografi.");
      try {
        const token = localStorage.getItem("token");
        if (token)
          await api.post(
            "/logs",
            { ...logPayload, status: "failed" },
            { headers: { Authorization: `Bearer ${token}` } },
          );
      } catch (logErr) {
        console.error("Gagal mengirim data ke audit log:", logErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col py-4 justify-center px-2 sm:px-4 max-w-3xl mx-auto w-full">
      <TabNavigation
        activeTab={activeTab}
        isLoading={isLoading}
        onTabChange={(tab) => {
          setActiveTab(tab);
          removeFile();
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white border border-slate-200 shadow-lg p-6 sm:p-8 rounded-b-2xl space-y-6"
      >
        <div>
          <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent mb-1.5 tracking-tight">
            {activeTab === "encrypt"
              ? "Secure File Encryption"
              : "Secure File Decryption"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            {activeTab === "encrypt"
              ? "Encrypt any file format securely with heavy enterprise AES-256-GCM architecture."
              : "Decrypt safely and instantly matching integrity cryptographic authorization tags."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <DropzoneInput
            file={file}
            activeTab={activeTab}
            dragActive={dragActive}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
            formatBytes={formatBytes}
          />

          <PasswordInput
            password={password}
            showPassword={showPassword}
            activeTab={activeTab}
            isLoading={isLoading}
            strength={strength}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
          />

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-lg flex items-start gap-3 shadow-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold">Error System Alert:</p>
                    <p className="mt-0.5 font-medium">{errorMsg}</p>
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-lg flex items-start gap-3 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Cryptographic Success:</p>
                    <p className="mt-0.5 font-medium">{successMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <ProcessingStatus
                currentStage={currentStage}
                activeStages={activeStages}
              />
            )}

            <motion.button
              whileHover={file && password && !isLoading ? { scale: 1.01 } : {}}
              whileTap={file && password && !isLoading ? { scale: 0.99 } : {}}
              type="submit"
              disabled={!file || !password || isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-sm tracking-wide text-white shadow-md flex items-center justify-center space-x-2 transition-all ${
                file && password && !isLoading
                  ? "bg-gradient-to-r from-[#0b2f9f] to-[#00809d] hover:opacity-95 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {activeTab === "encrypt" ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? "Encrypting Process..."
                      : "Run Secure Encryption"}
                  </span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? "Decrypting Process..."
                      : "Run Secure Decryption"}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
