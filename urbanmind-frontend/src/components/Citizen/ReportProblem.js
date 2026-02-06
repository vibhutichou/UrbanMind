import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ResponsiveLayout from '../Common/ResponsiveLayout';
import { createProblem, addProblemMedia } from '../../api/problemApi';
import {
  MapPin,
  Type,
  FileText,
  Tag,
  AlertTriangle,
  Globe,
  Navigation,
  UserX,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  UploadCloud,
  X,
} from 'lucide-react';

const ReportProblem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVolunteer = user?.role === 'volunteer';
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    severity: 'medium',
    tags: '',
    address_line: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: '',
    longitude: '',
    is_anonymous: false,
    is_donation_enabled: false,
    target_amount: '',
    media: null,
    
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // ========== HANDLERS ==========
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFormData((prev) => ({ ...prev, media: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, media: null }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  // ========== SUBMIT LOGIC WITH MEDIA UPLOAD ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the problem first
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        tags: formData.tags,
        addressLine: formData.address_line,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        isAnonymous: formData.is_anonymous,
        isDonationEnabled: formData.is_donation_enabled,
        targetAmount: formData.target_amount ? Number(formData.target_amount) : null,
      };

      const response = await createProblem(payload);
      const problemId = response.data?._id || response.data?.id;

      // 2. Upload media if exists
      if (formData.media && problemId) {
        const mediaFormData = new FormData();
        mediaFormData.append('file', formData.media);
        
        await addProblemMedia(problemId, mediaFormData);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Create problem failed:', err);
      alert('Failed to submit problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Infrastructure', 'Cleanliness', 'Electricity', 'Water', 'Traffic', 'Other'];
  const severities = ['low', 'medium', 'high', 'critical'];

  return (
    <ResponsiveLayout fullWidth showRightSidebar={false}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
          {isVolunteer ? 'Update Progress / Solution' : 'Report a Problem'}
        </h1>
      </div>

      <div className="p-6 md:p-8 pb-20 max-w-full mx-auto">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
          {/* Section 1: Basic Information */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Problem Details</h2>
                <p className="text-sm text-slate-500">Describe the issue in detail</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Type size={16} className="text-slate-400" /> Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Broken streetlight on Main Road"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  placeholder="Provide detailed information about the problem..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Tag size={16} className="text-slate-400" /> Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-slate-400" /> Severity
                  </label>
                  <div className="relative">
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    >
                      {severities.map((sev) => (
                        <option key={sev} value={sev} className="capitalize">
                          {sev.charAt(0).toUpperCase() + sev.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Tag size={16} className="text-slate-400" /> Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="e.g., #urgent, #pothole, #danger"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Location */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Location Details</h2>
                <p className="text-sm text-slate-500">Where is the problem located?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Address Line */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Address Line</label>
                <input
                  type="text"
                  name="address_line"
                  required
                  placeholder="e.g., Block A, Sector 4, Near City Park"
                  value={formData.address_line}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Country</label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="country"
                      required
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Navigation size={16} className="text-slate-400" /> Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Latitude (Optional)"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Navigation size={16} className="text-slate-400" /> Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Longitude (Optional)"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Additional Settings */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Additional Settings</h2>
                <p className="text-sm text-slate-500">Configure report privacy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Anonymous Checkbox */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-blue-200">
                <div className="flex items-center h-6">
                  <input
                    id="is_anonymous"
                    name="is_anonymous"
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="is_anonymous"
                    className="text-base font-bold text-slate-800 cursor-pointer select-none flex items-center gap-2"
                  >
                    <UserX size={18} className="text-slate-500" /> Post Anonymously
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Your name will be hidden from the public view.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Media Upload */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <ImageIcon size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Evidence / Media</h2>
                <p className="text-sm text-slate-500">Upload photos of the problem</p>
              </div>
            </div>

            <div className="space-y-4">
              {!previewUrl ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:bg-slate-50 transition-colors text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Click or drag to upload photo
                  </h3>
                  <p className="text-slate-500 mt-2">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video md:aspect-[21/9] group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={removeImage}
                      type="button"
                      className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg"
                    >
                      <X size={20} /> Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle size={24} /> Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h3>
            <p className="text-slate-500 mb-8">
              Thank you for being a responsible citizen. We have received your report.
            </p>
            <button
              onClick={() => navigate(isVolunteer ? '/volunteer/dashboard' : '/citizen/dashboard')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
};

export default ReportProblem;
