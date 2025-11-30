# Design Document

## Overview

This design implements a user design gallery feature for the GumWall application, enabling authenticated users to upload images to AWS S3 and view their collection through a responsive gallery interface. The solution leverages AWS Amplify Storage (Gen 2) to provide secure, user-scoped file storage with minimal backend configuration.

The implementation follows the existing Amplify Gen 2 architecture pattern used in the application, adding storage capabilities alongside the existing auth and data resources.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React App     │
│  (Frontend)     │
└────────┬────────┘
         │
         │ Amplify Storage API
         │
┌────────▼────────┐
│ Amplify Storage │
│   (Gen 2)       │
└────────┬────────┘
         │
         │ S3 API
         │
┌────────▼────────┐
│   Amazon S3     │
│    Bucket       │
└─────────────────┘
```

### Component Interaction Flow

1. **Upload Flow**:
   - User selects file in React component
   - Frontend validates file (type, size)
   - Amplify Storage uploads to S3 with user-scoped path
   - S3 returns success/failure
   - UI updates with confirmation

2. **Gallery View Flow**:
   - User navigates to My Designs page
   - Frontend requests file list from Amplify Storage
   - Amplify Storage queries S3 for user's files
   - Frontend generates signed URLs for thumbnails
   - Gallery renders images in grid layout

### Storage Structure

Files will be organized in S3 using the following path structure:

```
s3://bucket-name/
  └── {user-identity-id}/
      ├── uploads/
      │   ├── photo-1.jpg
      │   └── photo-2.png
      ├── templates/
      │   └── template-1.png
      └── ai-generated/
          └── result-1.jpg
```

## Components and Interfaces

### Backend Components

#### 1. Storage Resource Definition (`amplify/storage/resource.ts`)

```typescript
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'gumwallDesigns',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'templates/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'ai-generated/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
```

#### 2. Backend Configuration Update (`amplify/backend.ts`)

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

defineBackend({
  auth,
  data,
  storage,
});
```

### Frontend Components

#### 1. FileUpload Component

**Purpose**: Provides UI for file selection and upload with progress feedback

**Props**:
```typescript
interface FileUploadProps {
  onUploadComplete?: (key: string) => void;
  onUploadError?: (error: Error) => void;
  category?: 'uploads' | 'templates' | 'ai-generated';
  maxSizeMB?: number;
  acceptedFormats?: string[];
}
```

**Key Methods**:
- `handleFileSelect()`: Validates and initiates upload
- `uploadFile()`: Uploads file to S3 using Amplify Storage
- `updateProgress()`: Updates upload progress indicator

#### 2. DesignGallery Component

**Purpose**: Displays user's designs in a responsive grid layout

**Props**:
```typescript
interface DesignGalleryProps {
  filterByCategory?: 'all' | 'uploads' | 'templates' | 'ai-generated';
}
```

**State**:
```typescript
interface DesignGalleryState {
  designs: DesignItem[];
  loading: boolean;
  error: string | null;
  selectedFilter: string;
}

interface DesignItem {
  key: string;
  url: string;
  lastModified: Date;
  size: number;
  category: string;
}
```

**Key Methods**:
- `fetchDesigns()`: Retrieves list of user's files from S3
- `generateThumbnailUrl()`: Creates signed URL for image display
- `handleFilterChange()`: Filters designs by category
- `refreshGallery()`: Reloads design list

#### 3. MyDesigns Page Component

**Purpose**: Container page that combines upload and gallery components

**Structure**:
```typescript
const MyDesigns = () => {
  return (
    <div className="my-designs-page">
      <header>
        <h1>My Designs</h1>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </header>
      <DesignGallery filterByCategory="all" />
    </div>
  );
};
```

## Data Models

### File Metadata

While S3 stores the actual files, we'll use S3 object metadata and the file key structure to track design information:

```typescript
interface StoredFile {
  key: string;              // S3 object key (includes path)
  lastModified: Date;       // S3 object last modified date
  size: number;             // File size in bytes
  eTag: string;             // S3 ETag for versioning
}

interface DesignMetadata {
  key: string;
  url: string;              // Signed URL for display
  fileName: string;         // Extracted from key
  category: 'uploads' | 'templates' | 'ai-generated';
  uploadDate: Date;
  fileSize: number;
  fileType: string;         // MIME type
}
```

### Upload Progress

```typescript
interface UploadProgress {
  fileName: string;
  loaded: number;           // Bytes uploaded
  total: number;            // Total bytes
  percentage: number;       // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User file isolation

*For any* authenticated user, when listing files from S3 Storage, the returned files should only include files stored under that user's identity path and should not include files from other users.

**Validates: Requirements 3.2**

### Property 2: Upload path consistency

*For any* file upload with a specified category, the file should be stored in S3 with a key that includes the correct category prefix (uploads/, templates/, or ai-generated/).

**Validates: Requirements 5.1**

### Property 3: File type validation

*For any* file selected for upload, if the file type is not in the accepted formats list (JPEG, PNG, GIF), the upload should be rejected before any S3 API call is made.

**Validates: Requirements 6.1, 6.2**

### Property 4: Authenticated access enforcement

*For any* attempt to access upload functionality or the My Designs page, if the user is not authenticated, the application should prevent access and redirect to the login page.

**Validates: Requirements 3.4, 3.5**

### Property 5: Upload success confirmation

*For any* successful file upload to S3, the application should display a success message and the uploaded file should appear in the gallery view when refreshed.

**Validates: Requirements 1.4**

### Property 6: Signed URL generation

*For any* file retrieved from S3 for display, the application should generate a signed URL with an expiration time, ensuring temporary and secure access to the file.

**Validates: Requirements 3.3**

### Property 7: Empty gallery state

*For any* user with zero files in S3 Storage, when the My Designs page loads, the application should display an empty state message encouraging the user to upload their first design.

**Validates: Requirements 2.5**

### Property 8: File size validation

*For any* file selected for upload, if the file size exceeds the maximum allowed size (10MB), the upload should be rejected with an appropriate error message before any S3 API call is made.

**Validates: Requirements 6.3**

## Error Handling

### Upload Errors

1. **File Type Validation Error**
   - Trigger: User selects unsupported file type
   - Response: Display error toast with supported formats
   - Recovery: Allow user to select different file

2. **File Size Validation Error**
   - Trigger: File exceeds 10MB limit
   - Response: Display error with size limit information
   - Recovery: Allow user to select smaller file

3. **Network Error During Upload**
   - Trigger: Network interruption during S3 upload
   - Response: Display error message with retry option
   - Recovery: Implement retry mechanism with exponential backoff

4. **S3 Upload Failure**
   - Trigger: S3 API returns error (permissions, quota, etc.)
   - Response: Display user-friendly error message
   - Recovery: Log detailed error for debugging, allow retry

### Gallery Errors

1. **Failed to Load Designs**
   - Trigger: S3 list operation fails
   - Response: Display error message with retry button
   - Recovery: Implement retry mechanism

2. **Failed to Generate Signed URL**
   - Trigger: URL generation fails for specific file
   - Response: Display placeholder image with error indicator
   - Recovery: Skip failed file, continue loading others

3. **Authentication Error**
   - Trigger: User session expires during operation
   - Response: Redirect to login page
   - Recovery: Preserve intended action for post-login redirect

### Error Display Strategy

- Use toast notifications for transient errors
- Use inline error messages for form validation
- Use error boundaries for component-level failures
- Log all errors to console for debugging
- Provide actionable error messages to users

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Test Coverage**:

1. **FileUpload Component Tests**
   - File selection triggers upload
   - Invalid file type shows error
   - File size validation works correctly
   - Upload progress updates correctly
   - Success callback fires on completion
   - Error callback fires on failure

2. **DesignGallery Component Tests**
   - Renders empty state when no designs
   - Displays designs in grid layout
   - Filter functionality works correctly
   - Handles loading state appropriately
   - Handles error state appropriately

3. **Storage Utility Tests**
   - Path generation includes correct category
   - File metadata extraction works correctly
   - Signed URL generation succeeds

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must include a comment with the format:
`// Feature: user-design-gallery, Property {number}: {property_text}`

**Property Tests**:

1. **Property 1: User file isolation**
   ```typescript
   // Feature: user-design-gallery, Property 1: User file isolation
   test('user file isolation property', async () => {
     // Generate random user IDs and file lists
     // Verify list operation only returns files for specific user
   });
   ```

2. **Property 2: Upload path consistency**
   ```typescript
   // Feature: user-design-gallery, Property 2: Upload path consistency
   test('upload path consistency property', async () => {
     // Generate random file names and categories
     // Verify uploaded files have correct path prefix
   });
   ```

3. **Property 3: File type validation**
   ```typescript
   // Feature: user-design-gallery, Property 3: File type validation
   test('file type validation property', async () => {
     // Generate random file types (valid and invalid)
     // Verify only valid types pass validation
   });
   ```

4. **Property 4: Authenticated access enforcement**
   ```typescript
   // Feature: user-design-gallery, Property 4: Authenticated access enforcement
   test('authenticated access enforcement property', async () => {
     // Test with authenticated and unauthenticated states
     // Verify access control works correctly
   });
   ```

5. **Property 5: Upload success confirmation**
   ```typescript
   // Feature: user-design-gallery, Property 5: Upload success confirmation
   test('upload success confirmation property', async () => {
     // Upload random files
     // Verify success message and gallery update
   });
   ```

6. **Property 6: Signed URL generation**
   ```typescript
   // Feature: user-design-gallery, Property 6: Signed URL generation
   test('signed URL generation property', async () => {
     // Generate random file keys
     // Verify signed URLs are created with expiration
   });
   ```

7. **Property 7: Empty gallery state**
   ```typescript
   // Feature: user-design-gallery, Property 7: Empty gallery state
   test('empty gallery state property', async () => {
     // Test with users having zero files
     // Verify empty state message displays
   });
   ```

8. **Property 8: File size validation**
   ```typescript
   // Feature: user-design-gallery, Property 8: File size validation
   test('file size validation property', async () => {
     // Generate files of various sizes
     // Verify files over limit are rejected
   });
   ```

### Integration Testing

1. **End-to-End Upload Flow**
   - User selects file
   - File uploads to S3
   - File appears in gallery
   - File can be viewed

2. **Authentication Integration**
   - Unauthenticated users cannot access features
   - Authenticated users can upload and view files
   - User can only see their own files

3. **Error Recovery**
   - Network interruption during upload
   - Session expiration during operation
   - S3 service errors

### Manual Testing Checklist

- [ ] Upload various file types (JPEG, PNG, GIF)
- [ ] Upload files of different sizes
- [ ] Verify upload progress indicator
- [ ] Verify success/error messages
- [ ] View gallery with multiple files
- [ ] Test filter functionality
- [ ] Test empty state display
- [ ] Test on different screen sizes (responsive)
- [ ] Test with slow network connection
- [ ] Verify file isolation between users

## Implementation Notes

### Amplify Storage Configuration

- Use Amplify Gen 2 storage definition
- Configure user-scoped access patterns
- Set appropriate CORS policies automatically via Amplify
- Use default S3 bucket naming (Amplify-managed)

### Frontend Implementation

- Use `uploadData` from `aws-amplify/storage` for uploads
- Use `list` from `aws-amplify/storage` for gallery
- Use `getUrl` from `aws-amplify/storage` for signed URLs
- Implement progress tracking with upload callbacks
- Use React hooks for state management

### File Size Limits

- Maximum file size: 10MB
- Enforced client-side before upload
- Consider implementing S3 bucket policies for server-side enforcement

### Performance Considerations

- Lazy load images in gallery
- Implement pagination for large file lists
- Cache signed URLs with appropriate TTL
- Use thumbnail generation for large images (future enhancement)

### Security Considerations

- All file access scoped to authenticated user
- Signed URLs expire after 15 minutes
- No public read access to S3 bucket
- CORS configured to allow only application domain
