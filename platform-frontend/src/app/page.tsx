'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  // Show loading state until mounted and auth is checked
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading F1 Platform...</div>
        </div>
      </div>
    );
  }

  // If authenticated, show redirect message
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              🏎️ F1 Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your ultimate Formula 1 companion. Track drivers, constructors, and championship standings in real-time.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 border border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800 font-semibold rounded-xl transition-colors text-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything F1 in One Place
            </h2>
            <p className="text-gray-400 text-lg">
              Stay updated with the latest standings, statistics, and insights from the world of Formula 1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Driver Standings</h3>
              <p className="text-gray-400">
                Real-time championship standings with detailed driver statistics and performance metrics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Constructor Data</h3>
              <p className="text-gray-400">
                Comprehensive constructor standings and team performance analytics throughout the season.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Updates</h3>
              <p className="text-gray-400">
                Stay updated with the latest results, points, and championship changes as they happen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Personal Favorites</h3>
              <p className="text-gray-400">
                Track your favorite drivers and constructors with personalized dashboards and insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your F1 Journey?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of Formula 1 fans who rely on F1 Platform for the most comprehensive F1 data and analytics.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Start Free Today
          </Link>
        </div>
      </div>
    </div>
  );
}
