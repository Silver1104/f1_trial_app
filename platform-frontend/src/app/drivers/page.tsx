'use client';

import { useDrivers } from '@/hooks/useF1Data';
import DriverCard from '@/components/DriverCard';
import { Search, Filter, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function DriversPage() {
  const { drivers, isLoading, error } = useDrivers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.curr_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === '' || driver.curr_team === filterTeam;
    return matchesSearch && matchesTeam && driver.active;
  });

  const teams = [...new Set(drivers.map(driver => driver.curr_team))].sort();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading driver standings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load drivers</div>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Driver Standings</h1>
          </div>
          <p className="text-gray-400">2025 Formula 1 World Championship</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers, teams, or nationalities..."
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredDrivers.length} of {drivers.filter(d => d.active).length} drivers
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No drivers found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}
