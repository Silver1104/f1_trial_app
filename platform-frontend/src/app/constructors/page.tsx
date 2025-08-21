'use client';

import { useConstructors } from '@/hooks/useF1Data';
import ConstructorCard from '@/components/ConstructorCard';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';

export default function ConstructorsPage() {
  const { constructors, isLoading, error } = useConstructors();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConstructors = constructors.filter(constructor => {
    return constructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           constructor.nationality.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading constructor standings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load constructors</div>
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
            <Users className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Constructor Standings</h1>
          </div>
          <p className="text-gray-400">2025 Formula 1 Constructor Championship</p>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search constructors or nationalities..."
              className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredConstructors.length} of {constructors.length} constructors
          </div>
        </div>

        {/* Constructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConstructors.map((constructor) => (
            <ConstructorCard key={constructor.id} constructor={constructor} />
          ))}
        </div>

        {filteredConstructors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No constructors found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}
