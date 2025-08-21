import { CurrentConstructor } from '@/types';
import { Trophy, Target, Flag } from 'lucide-react';

interface ConstructorCardProps {
  constructor: CurrentConstructor;
}

export default function ConstructorCard({ constructor }: ConstructorCardProps) {
  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-400 bg-yellow-400/10';
    if (position === 2) return 'text-gray-300 bg-gray-300/10';
    if (position === 3) return 'text-orange-400 bg-orange-400/10';
    if (position <= 5) return 'text-green-400 bg-green-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  const getPositionIcon = (position: number) => {
    if (position <= 3) return <Trophy className="w-4 h-4" />;
    if (position <= 5) return <Target className="w-4 h-4" />;
    return <Flag className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getPositionColor(constructor.curr_pos)}`}>
          {getPositionIcon(constructor.curr_pos)}
          <span className="font-bold text-lg">P{constructor.curr_pos}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{constructor.curr_points}</div>
          <div className="text-sm text-gray-400">points</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{constructor.name}</h3>
        <p className="text-gray-400 text-sm">{constructor.nationality}</p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="text-center">
          <span className="text-gray-400 text-sm">Constructor ID</span>
          <p className="text-white font-mono text-sm mt-1">{constructor.id}</p>
        </div>
      </div>
    </div>
  );
}
