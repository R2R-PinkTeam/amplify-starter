/**
 * GumWall API Client
 *
 * Handles communication with the backend agent proxy API
 */

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000";

export interface AnalyzeWallRequest {
  s3_image_url: string;
  prompt?: string;
  include_mcp?: boolean;
}

export interface AnalyzeWallResponse {
  s3_image_url: string;
  feasibility_report: string;
}

export interface ApiError {
  error: string;
  message: string;
}

/**
 * Analyze a wall image for gum wall potential
 */
export async function analyzeWall(
  request: AnalyzeWallRequest
): Promise<AnalyzeWallResponse> {
  const response = await fetch(`${API_ENDPOINT}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || "Failed to analyze wall");
  }

  return response.json();
}

/**
 * Upload an image to S3 and get the URL
 * (This would integrate with your S3 upload mechanism)
 */
export async function uploadWallImage(_file: File): Promise<string> {
  // TODO: Implement S3 upload
  // For now, return a placeholder
  throw new Error("S3 upload not yet implemented");
}
