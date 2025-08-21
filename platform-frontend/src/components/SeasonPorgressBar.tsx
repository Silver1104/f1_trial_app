'use client';

import { useF1Races } from '@/hooks/useF1Data';
import { Calendar, Clock, MapPin, Flag, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
// Country to flag emoji mapping
const countryFlags: { [key: string]: string } = {
  'Australia': '🇦🇺',
  'China': '🇨🇳',
  'Japan': '🇯🇵',
  'Bahrain': '🇧🇭',
  'Saudi Arabia': '🇸🇦',
  'USA': '🇺🇸',
  'Italy': '🇮🇹',
  'Monaco': '🇲🇨',
  'Spain': '🇪🇸',
  'Canada': '🇨🇦',
  'Austria': '🇦🇹',
  'UK': '🇬🇧',
  'Belgium': '🇧🇪',
  'Hungary': '🇭🇺',
  'Netherlands': '🇳🇱',
  'Azerbaijan': '🇦🇿',
  'Singapore': '🇸🇬',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'Qatar': '🇶🇦',
  'UAE': '🇦🇪',
};

const circuitImages: { [key: string]: string } = {
  'albert_park': 'albert_park.jpg',
  'shanghai': 'shanghai.jpg', 
  'suzuka': 'suzuka.jpg',
  'bahrain': 'bahrain.jpg',
  'jeddah': 'jeddah.jpg',
  'miami': 'miami.jpg',
  'imola': 'imola.jpg',
  'monaco': 'monaco.jpg',
  'catalunya': 'catalunya.jpg',
  'villeneuve': 'villeneuve.jpg',
  'red_bull_ring': 'red_bull_ring.jpg',
  'silverstone': 'silverstone.jpg',
  'spa': 'spa.jpg',
  'hungaroring': 'hungaroring.jpg',
  'zandvoort': 'zandvoort.avif',
  'monza': 'monza.jpg',
  'baku': 'baku.jpg',
  'marina_bay': 'marina_bay.jpg',
  'americas': 'americas.jpg',
  'rodriguez': 'rodriguez.jpg',
  'interlagos': 'interlagos.jpg',
  'vegas': 'vegas.jpg',
  'losail': 'losail.jpg',
  'yas_marina': 'yas_marina.jpg',
};

// Helper function to get circuit image
const getCircuitImage = (circuitId: string): string => {
  return circuitImages[circuitId] || 'default_circuit.jpg';
};


export default function SeasonProgressBar() {
  const { raceProgress, seasonProgress, currentRace, nextRace, isLoading, error } = useF1Races();
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredRace, setHoveredRace] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-600 rounded-xl p-4 mb-8">
        <p className="text-red-400">Failed to load season progress: {error}</p>
      </div>
    );
  }

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getTimeUntilNext = (race: any) => {
    if (!race) return '';
    const now = new Date();
    const raceDate = new Date(`${race.date}T${race.time}`);
    const diff = raceDate.getTime() - now.getTime();
    
    if (diff <= 0) return '';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getCountryFlag = (country: string): string => {
    return countryFlags[country] || '🏁';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Flag className="w-5 h-5 text-red-500 mr-2" />
            2025 F1 Season Progress
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {Math.round(seasonProgress)}% Complete • {raceProgress.filter(r => r.status === 'completed').length} of {raceProgress.length} races finished
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

    {(currentRace || nextRace) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {currentRace && (
            <div 
                className="relative bg-red-600/20 border border-red-600/50 rounded-lg p-4 overflow-hidden"
                style={{
                backgroundImage: `url(/circuits/${getCircuitImage(currentRace.Circuit.circuitId)})`,
                backgroundSize: 'cover',
                backgroundPosition: '85% center', // Adjust this: increase to shift more right
                backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[0.5px]"></div>
                
                <div className="relative z-10">
                <div className="flex items-center text-red-400 mb-4">
                    <Play className="w-4 h-4 mr-2" />
                    <span className="font-semibold">LIVE NOW</span>
                </div>
                
                <h3 className="text-white font-bold flex items-center mb-3 drop-shadow-sm">
                    <span className="text-2xl mr-3">{getCountryFlag(currentRace.Circuit.Location.country)}</span>
                    {currentRace.raceName}
                </h3>
                
                <p className="text-gray-200 text-sm flex items-center mb-2 drop-shadow-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {currentRace.Circuit.Location.locality}, {currentRace.Circuit.Location.country}
                </p>
                
                {raceProgress.find(r => r.race.round === currentRace.round)?.currentSession && (
                    <div className="px-3 py-1 bg-red-600 text-white text-xs rounded-full font-semibold inline-block shadow-lg">
                    🔴 {raceProgress.find(r => r.race.round === currentRace.round)?.currentSession}
                    </div>
                )}
                </div>
            </div>
            )}

            {nextRace && !currentRace && (
            <div 
                className="relative bg-blue-600/20 border border-blue-600/50 rounded-lg p-4 overflow-hidden"
                style={{
                backgroundImage: `url(/circuits/${getCircuitImage(nextRace.Circuit.circuitId)})`,
                backgroundSize: 'cover',
                backgroundPosition: '85% center', // FIXED: should be 'center', not 'right'
                backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-blue-600/60 backdrop-blur-[0.5px]"></div>
                
                <div className="relative z-10">
                <div className="flex items-center text-blue-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-semibold">NEXT RACE</span>
                </div>
                
                <h3 className="text-white font-bold flex items-center mb-3 drop-shadow-sm">
                    <span className="text-2xl mr-3">{getCountryFlag(nextRace.Circuit.Location.country)}</span>
                    {nextRace.raceName}
                </h3>
                
                <p className="text-gray-200 text-sm flex items-center mb-2 drop-shadow-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}
                </p>
                
                <p className="text-gray-300 text-sm flex items-center drop-shadow-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDateTime(nextRace.date, nextRace.time)} IST
                    {getTimeUntilNext(nextRace) && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded shadow-lg">
                        in {getTimeUntilNext(nextRace)}
                    </span>
                    )}
                </p>
                </div>
            </div>
            )}
        </div>
        )}



      {/* Progress Bar */}
      <div className="relative">
        {/* Main progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${seasonProgress}%` }}
          ></div>
        </div>

        {/* Country Flag markers with Dynamic Colored Tooltips */}
        <div className="relative h-8">
          {raceProgress.map((raceData, index) => {
            const position = (index / (raceProgress.length - 1)) * 100;
            const isCompleted = raceData.status === 'completed';
            const isCurrent = raceData.status === 'current';
            
            // Define tooltip colors based on status
            const getTooltipColors = () => {
              if (isCompleted) {
                return {
                  bg: 'bg-green-800',
                  border: 'border-green-600',
                  arrow: 'border-t-green-800'
                };
              } else if (isCurrent) {
                return {
                  bg: 'bg-red-800',
                  border: 'border-red-600', 
                  arrow: 'border-t-red-800'
                };
              } else {
                return {
                  bg: 'bg-blue-800',
                  border: 'border-blue-600',
                  arrow: 'border-t-blue-800'
                };
              }
            };

            const tooltipColors = getTooltipColors();
            
            return (
              <div
                key={raceData.race.round}
                className="absolute transform -translate-x-1/2 group"
                style={{ left: `${position}%` }}
              >
                {/* Country Flag */}
                <div
                  className={`text-lg cursor-pointer transition-all ${
                    isCompleted
                      ? 'filter-none'
                      : isCurrent
                      ? 'animate-pulse'
                      : 'grayscale opacity-60'
                  }`}
                >
                  {getCountryFlag(raceData.race.Circuit.Location.country)}
                </div>

                {/* Dynamic Colored Tooltip */}
                <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 ${tooltipColors.bg} ${tooltipColors.border} text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border`}>
                  <div className="font-semibold">{raceData.race.raceName}</div>
                  <div className="text-gray-200">Round {raceData.race.round}</div>
                  <div className="text-gray-200">{formatDate(raceData.race.date, raceData.race.time)}</div>
                  {isCurrent && raceData.currentSession && (
                    <div className="text-yellow-300 font-semibold">{raceData.currentSession}</div>
                  )}
                  {raceData.nextSession && (
                    <div className="text-blue-200">Next: {raceData.nextSession.name}</div>
                  )}
                  {/* Dynamic Colored Tooltip Arrow */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${tooltipColors.arrow}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Percentage Display */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>Season Start</span>
        <span className="font-semibold text-white">
          {Math.round(seasonProgress)}% Complete
        </span>
        <span>Season End</span>
      </div>

      

      {/* Updated Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-400 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded mr-2 animate-pulse"></div>
          <span>Ongoing</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-1">🏁</span>
          <span>Country Flags</span>
        </div>
      </div>

      {/* Detailed Race List - unchanged */}
      {showDetails && (
        <div className="mt-6 border-t border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {raceProgress.map((raceData) => (
              <div
                key={raceData.race.round}
                className={`p-4 rounded-lg border transition-all ${
                  raceData.status === 'completed'
                    ? 'bg-green-900/20 border-green-600'
                    : raceData.status === 'current'
                    ? 'bg-yellow-900/20 border-yellow-600'
                    : 'bg-gray-700/50 border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-400">Round {raceData.race.round}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded font-semibold ${
                      raceData.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : raceData.status === 'current'
                        ? 'bg-yellow-600 text-black'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {raceData.status.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="text-white font-bold text-sm mb-1">{raceData.race.raceName}</h4>
                <p className="text-gray-300 text-xs mb-2">
                  {raceData.race.Circuit.Location.locality}, {raceData.race.Circuit.Location.country}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatDateTime(raceData.race.date, raceData.race.time)} IST
                </p>
                
                {raceData.status === 'current' && (
                  <div className="mt-2 space-y-1">
                    {raceData.currentSession && (
                      <div className="text-xs">
                        <span className="text-yellow-300">Now: </span>
                        <span className="text-white font-semibold">{raceData.currentSession}</span>
                      </div>
                    )}
                    {raceData.nextSession && (
                      <div className="text-xs">
                        <span className="text-blue-300">Next: </span>
                        <span className="text-white">{raceData.nextSession.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
