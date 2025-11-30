import { uploadData, list, getUrl, downloadData } from 'aws-amplify/storage';

/**
 * Supported file types for upload
 */
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Category types for file organization
 */
export type FileCategory = 'uploads' | 'templates' | 'ai-generated';

/**
 * Upload progress callback
 */
export interface UploadProgress {
  fileName: string;
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * Design metadata for gallery display
 */
export interface DesignMetadata {
  key: string;
  url: string;
  fileName: string;
  category: FileCategory;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
}

/**
 * Validation error types
 */
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

/**
 * Validates file type against accepted formats
 * @param file - File to validate
 * @throws FileValidationError if file type is not supported
 */
export function validateFileType(file: File): void {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw new FileValidationError(
      `Invalid file type. Supported formats: JPEG, PNG, GIF. Got: ${file.type}`
    );
  }
}

/**
 * Validates file size against maximum limit
 * @param file - File to validate
 * @throws FileValidationError if file size exceeds limit
 */
export function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    throw new FileValidationError(
      `File size exceeds limit. Maximum: ${maxSizeMB}MB, Got: ${sizeMB}MB`
    );
  }
}

/**
 * Generates storage path with category prefix
 * @param fileName - Original file name
 * @param category - File category for organization
 * @returns Storage path with category prefix
 */
export function generateStoragePath(
  fileName: string,
  category: FileCategory = 'uploads'
): string {
  // Sanitize filename to remove special characters
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${category}/${sanitizedName}`;
}

/**
 * Uploads a file to S3 storage with validation
 * @param file - File to upload
 * @param category - Category for file organization
 * @param onProgress - Optional progress callback
 * @returns Promise with upload result containing the file key
 */
export async function uploadFile(
  file: File,
  category: FileCategory = 'uploads',
  onProgress?: (progress: UploadProgress) => void
): Promise<{ key: string }> {
  // Validate file before upload
  validateFileType(file);
  validateFileSize(file);

  const path = generateStoragePath(file.name, category);

  try {
    const result = await uploadData({
      path,
      data: file,
      options: {
        onProgress: (event) => {
          if (onProgress && event.totalBytes) {
            const percentage = Math.round((event.transferredBytes / event.totalBytes) * 100);
            onProgress({
              fileName: file.name,
              loaded: event.transferredBytes,
              total: event.totalBytes,
              percentage,
              status: 'uploading',
            });
          }
        },
      },
    }).result;

    return { key: result.path };
  } catch (error) {
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lists all files for the authenticated user in a specific category
 * @param category - Optional category filter ('all' returns all categories)
 * @returns Promise with array of file metadata
 */
export async function listUserFiles(
  category?: FileCategory | 'all'
): Promise<DesignMetadata[]> {
  try {
    const designs: DesignMetadata[] = [];
    const categories: FileCategory[] =
      category && category !== 'all'
        ? [category]
        : ['uploads', 'templates', 'ai-generated'];

    for (const cat of categories) {
      console.log(`Listing files for category: ${cat}`);
      const result = await list({
        path: `${cat}/`,
      });

      console.log(`List result for ${cat}:`, result);

      for (const item of result.items) {
        // Skip directory entries
        if (item.path.endsWith('/')) continue;

        const fileName = item.path.split('/').pop() || item.path;

        console.log(`Processing item:`, {
          path: item.path,
          fileName,
          size: item.size,
          lastModified: item.lastModified
        });

        designs.push({
          key: item.path,
          url: '', // Will be populated by generateSignedUrl
          fileName,
          category: cat,
          uploadDate: item.lastModified || new Date(),
          fileSize: item.size || 0,
          fileType: getFileTypeFromName(fileName),
        });
      }
    }

    console.log(`Total designs found: ${designs.length}`);
    // Sort by upload date, newest first
    return designs.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  } catch (error) {
    console.error('Error in listUserFiles:', error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a signed URL for file access
 * @param key - S3 object key
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Promise with signed URL
 */
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    console.log(`Generating signed URL for key: ${key}`);

    // Use getUrl with proper options for authenticated access
    const result = await getUrl({
      path: key,
      options: {
        expiresIn,
        validateObjectExistence: false,
        useAccelerateEndpoint: false,
      },
    });

    const urlString = result.url.toString();
    console.log(`Generated URL for ${key}:`, urlString);
    return urlString;
  } catch (error) {
    console.error(`Error generating URL for ${key}:`, error);
    throw new Error(`Failed to generate URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to determine file type from filename
 * @param fileName - File name
 * @returns MIME type string
 */
function getFileTypeFromName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}
