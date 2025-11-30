import { useState, useEffect, useRef } from 'react';
import {
  listUserFiles,
  generateSignedUrl,
  DesignMetadata,
  FileCategory,
} from '../utils/storage';

interface DesignGalleryProps {
  filterByCategory?: 'all' | FileCategory;
  onRefresh?: () => void;
}

export default function DesignGallery({
  filterByCategory: initialFilter = 'all',
  onRefresh,
}: DesignGalleryProps) {
  const [designs, setDesigns] = useState<DesignMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | FileCategory>(initialFilter);

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const files = await listUserFiles(selectedFilter);

      // Generate signed URLs for each file
      const designsWithUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const url = await generateSignedUrl(file.key);
            return { ...file, url };
          } catch (urlError) {
            console.error(`Failed to generate URL for ${file.key}:`, urlError);
            // Return file with placeholder URL
            return { ...file, url: '' };
          }
        })
      );

      setDesigns(designsWithUrls);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load designs';
      setError(errorMessage);
      console.error('Error fetching designs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [selectedFilter]);

  const handleFilterChange = (filter: 'all' | FileCategory) => {
    setSelectedFilter(filter);
  };

  const handleRetry = () => {
    fetchDesigns();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryBadgeColor = (category: FileCategory) => {
    switch (category) {
      case 'uploads':
        return '#3b82f6';
      case 'templates':
        return '#8b5cf6';
      case 'ai-generated':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getCategoryLabel = (category: FileCategory) => {
    switch (category) {
      case 'uploads':
        return 'Upload';
      case 'templates':
        return 'Template';
      case 'ai-generated':
        return 'AI Generated';
      default:
        return category;
    }
  };

  // Lazy Loading Image Component
  const LazyImage = ({ src, alt, onError }: { src: string; alt: string; onError: (e: React.SyntheticEvent<HTMLImageElement>) => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      if (!imgRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observer.observe(imgRef.current);

      return () => {
        observer.disconnect();
      };
    }, []);

    return (
      <>
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}
        <img
          ref={imgRef}
          src={isInView ? src : ''}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={onError}
        />
      </>
    );
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div
      className="design-gallery-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '24px 0',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="skeleton-card"
          style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Image Skeleton */}
          <div
            className="skeleton-shimmer"
            style={{
              width: '100%',
              height: '200px',
              background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
          {/* Content Skeleton */}
          <div style={{ padding: '16px' }}>
            <div
              className="skeleton-shimmer"
              style={{
                height: '20px',
                background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '12px',
              }}
            />
            <div
              className="skeleton-shimmer"
              style={{
                height: '16px',
                width: '70%',
                background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
            />
            <div
              className="skeleton-shimmer"
              style={{
                height: '16px',
                width: '50%',
                background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="design-gallery-container">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="design-gallery-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px',
            padding: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', color: '#ef4444' }}></i>
          </div>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Failed to Load Designs</h3>
          <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '400px' }}>
            {error}
          </p>
          <button onClick={handleRetry} className="btn btn-primary">
            <i className="fas fa-redo me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (designs.length === 0) {
    return (
      <div className="design-gallery-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px',
            padding: '32px',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fas fa-images" style={{ fontSize: '48px', color: '#9ca3af' }}></i>
          </div>
          <h3 style={{ margin: 0, color: '#1f2937' }}>No Designs Yet</h3>
          <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '400px' }}>
            Start creating your gum wall art collection by uploading your first design!
          </p>
          <button onClick={onRefresh} className="btn btn-primary">
            <i className="fas fa-upload me-2"></i>
            Upload Your First Design
          </button>
        </div>
      </div>
    );
  }

  // Gallery Grid
  return (
    <div className="design-gallery-container">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .design-card {
          animation: fadeIn 0.3s ease-out;
        }

        /* Responsive grid adjustments */
        @media (max-width: 768px) {
          .design-gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
            gap: 16px !important;
          }

          .filter-controls {
            justify-content: center !important;
          }

          .filter-label {
            width: 100%;
            text-align: center;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 480px) {
          .design-gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        /* Enhanced hover effects */
        .design-card:hover .card-overlay {
          opacity: 1;
        }

        .design-card:hover .category-badge {
          transform: scale(1.05);
        }
      `}</style>

      {/* Filter Controls */}
      <div
        className="filter-controls"
        style={{
          display: 'flex',
          gap: '12px',
          padding: '24px 0 16px 0',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span
          className="filter-label"
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#6b7280',
            marginRight: '8px',
          }}
        >
          Filter by:
        </span>

        <button
          onClick={() => handleFilterChange('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: selectedFilter === 'all' ? '2px solid #FF6B9D' : '2px solid #e5e7eb',
            background: selectedFilter === 'all' ? '#fff5f7' : 'white',
            color: selectedFilter === 'all' ? '#FF6B9D' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (selectedFilter !== 'all') {
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFilter !== 'all') {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <i className="fas fa-th" style={{ fontSize: '0.875rem' }}></i>
          All Designs
        </button>

        <button
          onClick={() => handleFilterChange('uploads')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: selectedFilter === 'uploads' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
            background: selectedFilter === 'uploads' ? '#eff6ff' : 'white',
            color: selectedFilter === 'uploads' ? '#3b82f6' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (selectedFilter !== 'uploads') {
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFilter !== 'uploads') {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <i className="fas fa-upload" style={{ fontSize: '0.875rem' }}></i>
          Uploads
        </button>

        <button
          onClick={() => handleFilterChange('templates')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: selectedFilter === 'templates' ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
            background: selectedFilter === 'templates' ? '#f5f3ff' : 'white',
            color: selectedFilter === 'templates' ? '#8b5cf6' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (selectedFilter !== 'templates') {
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFilter !== 'templates') {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <i className="fas fa-palette" style={{ fontSize: '0.875rem' }}></i>
          Templates
        </button>

        <button
          onClick={() => handleFilterChange('ai-generated')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: selectedFilter === 'ai-generated' ? '2px solid #10b981' : '2px solid #e5e7eb',
            background: selectedFilter === 'ai-generated' ? '#f0fdf4' : 'white',
            color: selectedFilter === 'ai-generated' ? '#10b981' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (selectedFilter !== 'ai-generated') {
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedFilter !== 'ai-generated') {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <i className="fas fa-magic" style={{ fontSize: '0.875rem' }}></i>
          AI Generated
        </button>
      </div>

      <div
        className="design-gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          padding: '24px 0',
        }}
      >
        {designs.map((design, index) => (
          <div
            key={design.key}
            className="design-card"
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              animationDelay: `${index * 0.05}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 107, 157, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Image Container */}
            <div
              style={{
                width: '100%',
                height: '200px',
                background: '#f3f4f6',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {design.url ? (
                <LazyImage
                  src={design.url}
                  alt={design.fileName}
                  onError={(e) => {
                    // Show placeholder on image load error
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">
                          <i class="fas fa-image" style="font-size: 48px;"></i>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#9ca3af',
                  }}
                >
                  <i className="fas fa-image" style={{ fontSize: '48px' }}></i>
                </div>
              )}

              {/* Hover Overlay */}
              <div
                className="card-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                  <i className="fas fa-eye me-2"></i>
                  View Design
                </div>
              </div>

              {/* Category Badge */}
              <div
                className="category-badge"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: getCategoryBadgeColor(design.category),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {getCategoryLabel(design.category)}
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '16px' }}>
              <h4
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1f2937',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={design.fileName}
              >
                {design.fileName}
              </h4>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '4px',
                }}
              >
                <i className="far fa-calendar" style={{ fontSize: '0.875rem' }}></i>
                <span>{formatDate(design.uploadDate)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                }}
              >
                <i className="far fa-file" style={{ fontSize: '0.875rem' }}></i>
                <span>{formatFileSize(design.fileSize)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
