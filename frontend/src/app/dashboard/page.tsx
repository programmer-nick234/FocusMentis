'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tracksAPI, transformationsAPI, jobsAPI } from '@/lib/api';

interface Track {
  id: number;
  track_name: string;
  file_size_mb: number;
  created_at: string;
  file_url: string;
}

interface Transformation {
  id: number;
  original_track: Track;
  style: string;
  style_display: string;
  status: string;
  status_display: string;
  file_url?: string;
  created_at: string;
}

interface Job {
  id: number;
  transformed_track: Transformation;
  status: string;
  status_display: string;
  progress_percentage: number;
  created_at: string;
}

export default function Dashboard() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['lofi']);

  const availableStyles = [
    { value: 'lofi', label: 'Lo-fi', icon: '🎵', color: 'bg-gradient-to-r from-purple-600 to-purple-700' },
    { value: 'phonk', label: 'Phonk', icon: '🔥', color: 'bg-gradient-to-r from-pink-600 to-red-600' },
    { value: 'melody', label: 'Melody', icon: '🎶', color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
    { value: '8d', label: '8D Audio', icon: '🌊', color: 'bg-gradient-to-r from-green-600 to-teal-600' },
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tracksRes, transformationsRes, jobsRes] = await Promise.all([
        tracksAPI.getAll(),
        transformationsAPI.getAll(),
        jobsAPI.getActive(),
      ]);

      setTracks(tracksRes.data);
      setTransformations(transformationsRes.data);
      setActiveJobs(jobsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setTracks([]);
      setTransformations([]);
      setActiveJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('original_file', selectedFile);
    formData.append('track_name', selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension

    try {
      await tracksAPI.create(formData);
      setSelectedFile(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error uploading track:', error);
      alert('Failed to upload audio file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTransform = async (trackId: number) => {
    try {
      await tracksAPI.transform(trackId, selectedStyles);
      loadDashboardData();
    } catch (error) {
      console.error('Error transforming track:', error);
      alert('Failed to start transformation. Please try again.');
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
    return `${size.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white text-xl animate-pulse">Loading your audio workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="nav-responsive container mx-auto px-4 py-6 border-b border-gray-800">
        <div className="text-3xl font-bold gradient-text flex items-center gap-3">
          <span className="text-4xl">🎧</span>
          FocusMentex
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-ghost hover-lift"
            title="Transformation Settings"
          >
            <span className="text-2xl">⚙️</span>
          </button>
          <Link href="/" className="btn btn-ghost hover-lift">
            Home
          </Link>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass border-b border-gray-800 p-6 animate-fade-in">
          <div className="container mx-auto">
            <h3 className="text-xl font-semibold text-white mb-6">Transformation Styles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => toggleStyle(style.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover-lift ${
                    selectedStyles.includes(style.value)
                      ? `${style.color} border-white shadow-lg`
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-3">{style.icon}</div>
                  <div className="text-sm font-medium">{style.label}</div>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-6 leading-relaxed">
              Select one or more styles for transformation. You can change these settings anytime.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Audio File</h2>
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-white text-sm font-medium mb-3">Audio File (Max 4 minutes)</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white transition-all hover-lift"
                />
              </div>
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </span>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
            {selectedFile && (
              <p className="text-gray-400 text-sm animate-fade-in">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            )}
          </form>
        </div>

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <div className="card mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Processing...</h2>
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="glass p-6 rounded-xl hover-lift">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg mb-2">
                        {job.transformed_track.original_track.track_name} - {job.transformed_track.style_display}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Status: {job.status_display} • Progress: {job.progress_percentage}%
                      </div>
                    </div>
                    <div className="w-full lg:w-48 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${job.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracks */}
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6">Your Audio Files</h2>
          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-400 text-lg mb-4">No audio files uploaded yet.</p>
              <p className="text-gray-500">Upload your first file to get started!</p>
            </div>
          ) : (
            <div className="grid-responsive">
              {tracks.map((track) => (
                <div key={track.id} className="card hover-lift animate-scale-in">
                  <div className="text-white font-semibold text-lg mb-3">{track.track_name}</div>
                  <div className="text-gray-400 text-sm mb-6">
                    {formatFileSize(track.file_size_mb)} • {formatDate(track.created_at)}
                  </div>
                  <button
                    onClick={() => handleTransform(track.id)}
                    disabled={selectedStyles.length === 0}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                  >
                    Transform to {selectedStyles.map(s => availableStyles.find(style => style.value === s)?.label).join(', ')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transformations */}
        {transformations.length > 0 && (
          <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Your Transformations</h2>
            <div className="grid-responsive">
              {transformations.map((transformation) => (
                <div key={transformation.id} className="card hover-lift animate-scale-in">
                  <div className="text-white font-semibold text-lg mb-3">
                    {transformation.original_track.track_name}
                  </div>
                  <div className="text-purple-300 text-sm mb-3 font-medium">{transformation.style_display}</div>
                  <div className="text-gray-400 text-sm mb-6">
                    Status: {transformation.status_display} • {formatDate(transformation.created_at)}
                  </div>
                  {transformation.status === 'completed' && transformation.file_url ? (
                    <a
                      href={transformation.file_url}
                      download
                      className="btn btn-secondary w-full text-center hover-lift"
                    >
                      Download
                    </a>
                  ) : (
                    <div className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-center opacity-75 cursor-not-allowed">
                      {transformation.status === 'processing' ? 'Processing...' : 'File Not Ready'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
