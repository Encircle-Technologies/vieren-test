// src/templates/preview.tsx
import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import Layout from "../utils/Layout" // Adjust import path as needed

interface PreviewData {
  id: number
  databaseId: number
  title: string
  content: string
  excerpt: string
  status: string
  uri: string
  slug: string
  date: string
  modified: string
  author: string
  featuredImage?: {
    id: number
    url: string
    alt: string
  }
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  acf: Record<string, any>
  preview: boolean
  timestamp: number
}

const PreviewTemplate: React.FC = () => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const previewId = urlParams.get('previewId')
    const isPreview = urlParams.get('preview') === 'true'

    if (!isPreview || !previewId) {
      // If not a preview request, redirect to regular page
      const currentPath = window.location.pathname
      navigate(currentPath.replace('/preview', ''))
      return
    }

    // Fetch preview data from WordPress
    fetchPreviewData(previewId)
  }, [])

  const fetchPreviewData = async (postId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `https://vieren-cms-prod.zuratech.ca/wp-admin/admin-ajax.php?action=gatsby_preview&post_id=${postId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.data || 'Failed to fetch preview data')
      }

      setPreviewData(result.data)
    } catch (err) {
      console.error('Preview fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load preview content')
    } finally {
      setLoading(false)
    }
  }

  const refreshPreview = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const previewId = urlParams.get('previewId')
    if (previewId) {
      fetchPreviewData(previewId)
    }
  }

  const viewPublished = () => {
    if (previewData?.uri) {
      window.open(`https://vieren-test.netlify.app${previewData.uri}`, '_blank')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '2rem'
          }} />
          <h2 style={{ marginBottom: '1rem' }}>Loading VIEREN Preview...</h2>
          <p style={{ color: '#666' }}>Fetching the latest content from WordPress.</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Layout>
    )
  }

  if (error || !previewData) {
    return (
      <Layout>
        <div style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Preview Error</h2>
          <p style={{ marginBottom: '2rem', maxWidth: '500px' }}>
            {error || 'Unable to load preview content. This might be due to permissions or network issues.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={refreshPreview}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = 'https://vieren-cms-prod.zuratech.ca/wp-admin/'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#000',
                border: '2px solid #000',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to WordPress
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Preview banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: 'white',
          padding: '1rem 2rem',
          textAlign: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <strong>🔍 PREVIEW MODE</strong> - Viewing unpublished content
            <div style={{ fontSize: '0.85em', opacity: 0.9 }}>
              Status: {previewData.status} | Last modified: {new Date(previewData.modified).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              onClick={refreshPreview}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em'
              }}
            >
              🔄 Refresh
            </button>
            <button 
              onClick={viewPublished}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                color: '#f39c12',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: 'bold'
              }}
            >
              📄 View Published
            </button>
          </div>
        </div>
      </div>

      {/* Render preview content */}
      <article style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            {previewData.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            color: '#666', 
            fontSize: '0.9rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div>By: {previewData.author}</div>
            <div>Updated: {new Date(previewData.modified).toLocaleString()}</div>
            <div>Status: <span style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: previewData.status === 'publish' ? '#27ae60' : '#f39c12',
              color: 'white',
              borderRadius: '3px',
              fontSize: '0.8rem'
            }}>{previewData.status}</span></div>
          </div>

          {/* Categories and Tags */}
          {(previewData.categories.length > 0 || previewData.tags.length > 0) && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {previewData.categories.length > 0 && (
                <div>
                  <strong>Categories:</strong> {previewData.categories.map(cat => cat.name).join(', ')}
                </div>
              )}
              {previewData.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong> {previewData.tags.map(tag => tag.name).join(', ')}
                </div>
              )}
            </div>
          )}
        </header>
        
        {/* Featured Image */}
        {previewData.featuredImage && (
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src={previewData.featuredImage.url} 
              alt={previewData.featuredImage.alt || previewData.title}
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        {/* Content */}
        <div 
          style={{ 
            lineHeight: '1.7',
            fontSize: '1.1rem'
          }}
          dangerouslySetInnerHTML={{ __html: previewData.content }}
        />

        {/* ACF Fields Debug (for development) */}
        {Object.keys(previewData.acf).length > 0 && process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '3rem', 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3>ACF Fields (Development Only)</h3>
            <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
              {JSON.stringify(previewData.acf, null, 2)}
            </pre>
          </div>
        )}
      </article>
    </Layout>
  )
}

export default PreviewTemplate