import { useState, useRef } from 'react';
import {
  uploadFile,
  FileCategory,
  UploadProgress,
  FileValidationError,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../utils/storage';

interface FileUploadProps {
  onUploadComplete?: (key: string) => void;
  onUploadError?: (error: Error) => void;
  category?: FileCategory;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface FileUploadState extends UploadProgress {
  id: string;
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  category = 'uploads',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileUploads, setFileUploads] = useState<FileUploadState[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdCounter = useRef(0);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = toastIdCounter.current++;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    // Convert FileList to Array
    const fileArray = Array.from(files);

    // Initialize upload states for all files
    const initialUploads: FileUploadState[] = fileArray.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      fileName: file.name,
      loaded: 0,
      total: file.size,
      percentage: 0,
      status: 'pending' as const,
    }));

    setFileUploads(initialUploads);

    // Upload files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadId = initialUploads[i].id;

      try {
        // Update status to uploading
        setFileUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId ? { ...upload, status: 'uploading' as const } : upload
          )
        );

        const result = await uploadFile(file, category, (progressUpdate) => {
          setFileUploads((prev) =>
            prev.map((upload) =>
              upload.id === uploadId
                ? {
                    ...upload,
                    loaded: progressUpdate.loaded,
                    percentage: progressUpdate.percentage,
                    status: 'uploading' as const,
                  }
                : upload
            )
          );
        });

        // Mark as success
        setFileUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId
              ? {
                  ...upload,
                  loaded: file.size,
                  percentage: 100,
                  status: 'success' as const,
                }
              : upload
          )
        );

        showToast('success', `Successfully uploaded ${file.name}`);
        onUploadComplete?.(result.key);
      } catch (error) {
        const errorMessage =
          error instanceof FileValidationError
            ? error.message
            : error instanceof Error
            ? error.message
            : 'Upload failed. Please try again.';

        // Mark as error
        setFileUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId
              ? {
                  ...upload,
                  status: 'error' as const,
                  error: errorMessage,
                }
              : upload
          )
        );

        showToast('error', `${file.name}: ${errorMessage}`);
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    }

    // Reset after all uploads complete
    setTimeout(() => {
      setFileUploads([]);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 3000);
  };

  const formatFileTypes = () => {
    return ACCEPTED_FILE_TYPES.map((type) => type.split('/')[1].toUpperCase()).join(', ');
  };

  const formatFileSize = () => {
    return `${(MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0)}MB`;
  };

  return (
    <>
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minWidth: '300px',
              maxWidth: '500px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>
                {toast.type === 'success' ? '✓' : '✕'}
              </span>
              <span style={{ flex: 1 }}>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Component */}
      <div className="file-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          multiple
          style={{ display: 'none' }}
        />

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="btn btn-primary"
          style={{
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          <i className="fas fa-upload me-2"></i>
          {uploading ? 'Uploading...' : 'Upload Design'}
        </button>

        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
          Supported formats: {formatFileTypes()} • Max size: {formatFileSize()} • Multiple files supported
        </div>

        {/* Progress Indicators for Multiple Files */}
        {fileUploads.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {fileUploads.map((upload) => (
              <div
                key={upload.id}
                style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {upload.fileName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color:
                        upload.status === 'success'
                          ? '#10b981'
                          : upload.status === 'error'
                          ? '#ef4444'
                          : '#3b82f6',
                    }}
                  >
                    {upload.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${upload.percentage}%`,
                      height: '100%',
                      background:
                        upload.status === 'success'
                          ? '#10b981'
                          : upload.status === 'error'
                          ? '#ef4444'
                          : '#3b82f6',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Status Message */}
                {upload.status === 'success' && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '0.875rem',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fas fa-check-circle"></i>
                    Upload complete!
                  </div>
                )}

                {upload.status === 'error' && upload.error && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '0.875rem',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fas fa-exclamation-circle"></i>
                    {upload.error}
                  </div>
                )}

                {upload.status === 'pending' && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fas fa-clock"></i>
                    Waiting...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
