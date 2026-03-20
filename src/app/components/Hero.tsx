import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Trash2, Upload, Shield, Zap, UserCheck } from 'lucide-react';

export function Hero() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL ?? 'https://toolhub-wtdi.onrender.com';
  const maxFileSizeBytes = 50 * 1024 * 1024;

  const previewItems = useMemo(() => {
    return selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [previewItems]);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const setImageFiles = (files: File[]) => {
    setSelectedFiles(files);
    setUploadedFile(files.length === 1 ? files[0].name : `${files.length} imágenes seleccionadas`);
    setUploadProgress(0);
    setErrorMessage(null);
  };

  const addImageFiles = (files: File[]) => {
    setSelectedFiles((prev) => {
      const updated = [...prev, ...files];
      setUploadedFile(updated.length === 1 ? updated[0].name : `${updated.length} imágenes seleccionadas`);
      return updated;
    });
    setUploadProgress(0);
    setErrorMessage(null);
  };

  const validateFiles = (files: File[]) => {
    const invalidType = files.find((file) => !file.type.startsWith('image/'));
    if (invalidType) {
      return 'Solo se permiten imágenes (JPG, PNG o WebP).';
    }

    const tooLarge = files.find((file) => file.size > maxFileSizeBytes);
    if (tooLarge) {
      return 'Cada imagen debe pesar menos de 50 MB.';
    }

    return null;
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setSelectedFiles((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setUploadedFile(updated.length === 1 ? updated[0].name : `${updated.length} imágenes seleccionadas`);
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, fileIndex) => fileIndex !== index);
      setUploadedFile(updated.length === 0 ? null : updated.length === 1 ? updated[0].name : `${updated.length} imágenes seleccionadas`);
      return updated;
    });
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOverItem = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropItem = () => {
    if (dragIndex === null || dragOverIndex === null) {
      return;
    }
    if (dragIndex !== dragOverIndex) {
      moveFile(dragIndex, dragOverIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  const uploadAndConvert = async () => {
    if (selectedFiles.length === 0 || isUploading) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUrl}/convert`);
        request.responseType = 'blob';

        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) {
            return;
          }
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        };

        request.onload = () => {
          if (request.status >= 200 && request.status < 300) {
            setUploadProgress(100);
            const blob = request.response;
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const outputName = selectedFiles.length === 1
              ? selectedFiles[0].name.replace(/\.[^/.]+$/, '.pdf')
              : 'imagenes.pdf';
            link.href = downloadUrl;
            link.download = outputName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            resolve();
          } else {
            reject(new Error('No se pudo convertir el archivo.'));
          }
        };

        request.onerror = () => {
          reject(new Error('No se pudo conectar con el servidor.'));
        };

        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
        request.send(formData);
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error inesperado.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileList = Array.from(files);
      const validationError = validateFiles(fileList);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }
      addImageFiles(fileList);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const validationError = validateFiles(fileList);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }
      setImageFiles(fileList);
    }
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const validationError = validateFiles(fileList);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }
      addImageFiles(fileList);
    }
  };

  return (
  <section id="upload" className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Convierte Imágenes a PDF
          <br />
          <span className="text-blue-600">En Segundos</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Convierte tus imágenes en un PDF listo para compartir con calidad perfecta.
          Rápido, seguro e increíblemente fácil de usar.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-gray-700">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Seguro y Privado</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Sin Registro</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>Súper Rápido</span>
          </div>
        </div>

        {/* Upload Box */}
          <div className="max-w-2xl mx-auto">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 transition-all
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 bg-white hover:border-blue-400'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              {uploadedFile ? (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">✓ {uploadedFile}</p>
                  <p className="text-sm text-gray-500">
                    {isUploading ? 'Subiendo imágenes...' : 'Listo para convertir'}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Arrastra tus imágenes aquí
                  </p>
                  <p className="text-sm text-gray-500">
                    o haz clic para seleccionar
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 mb-3">
                <span>Ordena las imágenes (arrastra o usa las flechas)</span>
                <span>
                  {selectedFiles.length} archivos · {formatFileSize(totalSize)}
                </span>
              </div>
              <ul className="space-y-3">
                {previewItems.map(({ file, previewUrl }, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-all ${
                      dragOverIndex === index ? 'border-blue-400 bg-blue-50' : 'border-gray-100'
                    }`}
                    draggable={!isUploading}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(event) => handleDragOverItem(event, index)}
                    onDrop={handleDropItem}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-400">
                        <GripVertical className="h-4 w-4" />
                      </span>
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {index + 1}. {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        onClick={() => moveFile(index, index - 1)}
                        disabled={index === 0 || isUploading}
                        aria-label="Mover arriba"
                      >
                        <ArrowUp className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        onClick={() => moveFile(index, index + 1)}
                        disabled={index === selectedFiles.length - 1 || isUploading}
                        aria-label="Mover abajo"
                      >
                        <ArrowDown className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 disabled:opacity-40"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                        aria-label="Eliminar imagen"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Agregar más imágenes
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddMore}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">Puedes seguir añadiendo imágenes al lote.</span>
              </div>
            </div>
          )}

          {uploadedFile && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{isUploading ? 'Subiendo...' : 'Listo'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-sm text-red-600 mt-4">{errorMessage}</p>
          )}

          <button
            className="w-full mt-6 bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            disabled={isUploading || selectedFiles.length === 0}
            onClick={uploadAndConvert}
          >
            {uploadedFile ? (isUploading ? 'Subiendo imágenes...' : 'Convertir a PDF') : 'Subir imágenes'}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Los archivos se eliminan automáticamente después de 1 hora
          </p>
        </div>
      </div>
    </section>
  );
}