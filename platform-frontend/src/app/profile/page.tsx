'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDrivers, useConstructors } from '@/hooks/useF1Data';
import { apiClient } from '@/lib/api';
import { UserDetails } from '@/types';
import { User, Edit3, Save, X, Calendar, Globe, Heart } from 'lucide-react';

export default function ProfilePage() {
  const { user, userDetails, refreshUserDetails } = useAuth();
  const { drivers } = useDrivers();
  const { constructors } = useConstructors();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserDetails>({
    name: '',
    dob: '',
    fav_driver: '',
    fav_constructor: '',
    country: '',
  });

  useEffect(() => {
    if (userDetails) {
      setFormData({
        name: userDetails.name || '',
        dob: userDetails.dob || '',
        fav_driver: userDetails.fav_driver || '',
        fav_constructor: userDetails.fav_constructor || '',
        country: userDetails.country || '',
      });
    }
  }, [userDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiClient.patch('/users/details', formData);
      await refreshUserDetails();
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteDriver = drivers.find(d => d.id === userDetails?.fav_driver);
  const favoriteConstructor = constructors.find(c => c.id === userDetails?.fav_constructor);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                  <p className="text-red-100">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-600/10 border border-red-600 text-red-400 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.dob || ''}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="Enter your country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Favorite Driver
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.fav_driver || ''}
                      onChange={(e) => setFormData({...formData, fav_driver: e.target.value})}
                    >
                      <option value="">Select a driver</option>
                      {drivers.filter(d => d.active).map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.full_name} ({driver.curr_team})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Favorite Constructor
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={formData.fav_constructor || ''}
                      onChange={(e) => setFormData({...formData, fav_constructor: e.target.value})}
                    >
                      <option value="">Select a constructor</option>
                      {constructors.map(constructor => (
                        <option key={constructor.id} value={constructor.id}>
                          {constructor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm">Full Name</span>
                        <p className="text-white font-medium">{userDetails?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Date of Birth</span>
                        <p className="text-white font-medium">{userDetails?.dob || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm">Country</span>
                        <p className="text-white font-medium">{userDetails?.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Prediction Points</span>
                        <p className="text-white font-medium">{userDetails?.prediction_points || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* F1 Preferences */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">F1 Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Favorite Driver</h3>
                      {favoriteDriver ? (
                        <div>
                          <p className="text-white font-medium">{favoriteDriver.full_name}</p>
                          <p className="text-gray-400">{favoriteDriver.curr_team}</p>
                          <p className="text-sm text-gray-500">
                            P{favoriteDriver.curr_pos} • {favoriteDriver.curr_points} points
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">Not selected</p>
                      )}
                    </div>

                    <div className="bg-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Favorite Constructor</h3>
                      {favoriteConstructor ? (
                        <div>
                          <p className="text-white font-medium">{favoriteConstructor.name}</p>
                          <p className="text-gray-400">{favoriteConstructor.nationality}</p>
                          <p className="text-sm text-gray-500">
                            P{favoriteConstructor.curr_pos} • {favoriteConstructor.curr_points} points
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">Not selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
