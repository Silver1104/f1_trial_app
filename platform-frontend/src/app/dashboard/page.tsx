'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useDrivers, useConstructors } from '@/hooks/useF1Data';
import Link from 'next/link';
import { Trophy, Users, Star, TrendingUp } from 'lucide-react';
import SeasonProgressBar from '@/components/SeasonPorgressBar';

export default function DashboardPage() {
  const { user, userDetails } = useAuth();
  const { drivers, isLoading: driversLoading } = useDrivers();
  const { constructors, isLoading: constructorsLoading } = useConstructors();

  const topDrivers = drivers.slice(0, 3);
  const topConstructors = constructors.slice(0, 3);

  const favoriteDriver = drivers.find(d => d.id === userDetails?.fav_driver);
  const favoriteConstructor = constructors.find(c => c.id === userDetails?.fav_constructor);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}! 🏎️
          </h1>
          <p className="text-gray-400">Here's your F1 Platform overview</p>
        </div>

        {/* Season Progress Bar */}
        <SeasonProgressBar />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <Trophy className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{drivers.length}</p>
                <p className="text-gray-400 text-sm">Active Drivers</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{constructors.length}</p>
                <p className="text-gray-400 text-sm">Constructors</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">2025</p>
                <p className="text-gray-400 text-sm">Current Season</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{userDetails?.prediction_points || 0}</p>
                <p className="text-gray-400 text-sm">Your Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {(favoriteDriver || favoriteConstructor) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteDriver && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Favorite Driver</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">{favoriteDriver.full_name}</p>
                      <p className="text-gray-400">{favoriteDriver.curr_team}</p>
                      <p className="text-sm text-gray-500">P{favoriteDriver.curr_pos} • {favoriteDriver.curr_points} pts</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                        #{favoriteDriver.perm_number}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {favoriteConstructor && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Favorite Team</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">{favoriteConstructor.name}</p>
                      <p className="text-gray-400">{favoriteConstructor.nationality}</p>
                      <p className="text-sm text-gray-500">P{favoriteConstructor.curr_pos} • {favoriteConstructor.curr_points} pts</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Drivers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Championship Leaders</h2>
              <Link 
                href="/drivers" 
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {driversLoading ? (
              <div className="text-gray-400">Loading drivers...</div>
            ) : (
              <div className="space-y-4">
                {topDrivers.map((driver, index) => (
                  <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        'bg-orange-400 text-black'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{driver.full_name}</p>
                        <p className="text-gray-400 text-sm">{driver.curr_team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{driver.curr_points}</p>
                      <p className="text-gray-400 text-sm">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Constructors */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Constructor Standings</h2>
              <Link 
                href="/constructors" 
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {constructorsLoading ? (
              <div className="text-gray-400">Loading constructors...</div>
            ) : (
              <div className="space-y-4">
                {topConstructors.map((constructor, index) => (
                  <div key={constructor.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        'bg-orange-400 text-black'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{constructor.name}</p>
                        <p className="text-gray-400 text-sm">{constructor.nationality}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{constructor.curr_points}</p>
                      <p className="text-gray-400 text-sm">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
