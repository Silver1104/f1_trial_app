'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { CurrentDriver, CurrentConstructor, F1Race, F1RacesResponse, RaceProgress } from '@/types';

export function useDrivers() {
  const [races, setRaces] = useState<F1Race[]>([]);
  const [raceProgress, setRaceProgress] = useState<RaceProgress[]>([]);
  const [seasonProgress, setSeasonProgress] = useState(0);
  const [currentRace, setCurrentRace] = useState<F1Race | null>(null);
  const [nextRace, setNextRace] = useState<F1Race | null>(null);
  const [drivers, setDrivers] = useState<CurrentDriver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<CurrentDriver[]>('/drivers/standings');
      setDrivers(response.sort((a, b) => a.curr_pos - b.curr_pos));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch drivers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return { drivers, isLoading, error, refetch: fetchDrivers };
}

export function useConstructors() {
  const [constructors, setConstructors] = useState<CurrentConstructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConstructors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<CurrentConstructor[]>('/constructors/standings');
      setConstructors(response.sort((a, b) => a.curr_pos - b.curr_pos));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch constructors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConstructors();
  }, []);

  return { constructors, isLoading, error, refetch: fetchConstructors };
}

export function useF1Races() {
  const [races, setRaces] = useState<F1Race[]>([]);
  const [raceProgress, setRaceProgress] = useState<RaceProgress[]>([]);
  const [seasonProgress, setSeasonProgress] = useState(0);
  const [currentRace, setCurrentRace] = useState<F1Race | null>(null);
  const [nextRace, setNextRace] = useState<F1Race | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://api.jolpi.ca/ergast/f1/2025/races');
      if (!response.ok) {
        throw new Error('Failed to fetch races');
      }
      
      const data: F1RacesResponse = await response.json();
      const racesData = data.MRData.RaceTable.Races;
      
      setRaces(racesData);
      calculateProgress(racesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch F1 races');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (racesData: F1Race[]) => {
    const now = new Date();
    const progressData: RaceProgress[] = [];
    let completedRaces = 0;
    let currentRaceFound: F1Race | null = null;
    let nextRaceFound: F1Race | null = null;

    racesData.forEach((race, index) => {
      const raceDate = new Date(`${race.date}T${race.time}`);
      const raceWeekendStart = getRaceWeekendStart(race);
      const raceWeekendEnd = new Date(raceDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after race

      let status: 'upcoming' | 'current' | 'completed';
      let progress = 0;
      let currentSession: string | undefined;
      let nextSession: { name: string; date: Date } | undefined;

      if (now < raceWeekendStart) {
        status = 'upcoming';
        progress = 0;
        if (!nextRaceFound) {
          nextRaceFound = race;
        }
      } else if (now > raceWeekendEnd) {
        status = 'completed';
        progress = 100;
        completedRaces++;
      } else {
        status = 'current';
        currentRaceFound = race;
        
        // Calculate progress within race weekend
        const weekendDuration = raceWeekendEnd.getTime() - raceWeekendStart.getTime();
        const elapsed = now.getTime() - raceWeekendStart.getTime();
        progress = Math.min(100, Math.max(0, (elapsed / weekendDuration) * 100));

        // Determine current/next session
        const sessionInfo = getCurrentSession(race, now);
        currentSession = sessionInfo.current;
        nextSession = sessionInfo.next;
      }

      progressData.push({
        race,
        status,
        progress,
        currentSession,
        nextSession,
      });
    });

    // Calculate overall season progress
    const totalRaces = racesData.length;
    const overallProgress = totalRaces > 0 ? (completedRaces / totalRaces) * 100 : 0;

    setRaceProgress(progressData);
    setSeasonProgress(overallProgress);
    setCurrentRace(currentRaceFound);
    setNextRace(nextRaceFound);
  };

  const getRaceWeekendStart = (race: F1Race): Date => {
    // Find the earliest session (usually FP1 or Sprint Qualifying)
    const sessions = [];
    
    if (race.FirstPractice) sessions.push(new Date(`${race.FirstPractice.date}T${race.FirstPractice.time}`));
    if (race.SprintQualifying) sessions.push(new Date(`${race.SprintQualifying.date}T${race.SprintQualifying.time}`));
    if (race.SecondPractice) sessions.push(new Date(`${race.SecondPractice.date}T${race.SecondPractice.time}`));
    if (race.ThirdPractice) sessions.push(new Date(`${race.ThirdPractice.date}T${race.ThirdPractice.time}`));
    if (race.Qualifying) sessions.push(new Date(`${race.Qualifying.date}T${race.Qualifying.time}`));
    if (race.Sprint) sessions.push(new Date(`${race.Sprint.date}T${race.Sprint.time}`));
    
    sessions.push(new Date(`${race.date}T${race.time}`)); // Race itself
    
    return new Date(Math.min(...sessions.map(d => d.getTime())));
  };

  const getCurrentSession = (race: F1Race, now: Date) => {
    const sessions = [
      { name: 'FP1', date: race.FirstPractice ? new Date(`${race.FirstPractice.date}T${race.FirstPractice.time}`) : null },
      { name: 'Sprint Qualifying', date: race.SprintQualifying ? new Date(`${race.SprintQualifying.date}T${race.SprintQualifying.time}`) : null },
      { name: 'FP2', date: race.SecondPractice ? new Date(`${race.SecondPractice.date}T${race.SecondPractice.time}`) : null },
      { name: 'FP3', date: race.ThirdPractice ? new Date(`${race.ThirdPractice.date}T${race.ThirdPractice.time}`) : null },
      { name: 'Qualifying', date: race.Qualifying ? new Date(`${race.Qualifying.date}T${race.Qualifying.time}`) : null },
      { name: 'Sprint', date: race.Sprint ? new Date(`${race.Sprint.date}T${race.Sprint.time}`) : null },
      { name: 'Race', date: new Date(`${race.date}T${race.time}`) },
    ].filter(s => s.date !== null).sort((a, b) => a.date!.getTime() - b.date!.getTime());

    let current: string | undefined;
    let next: { name: string; date: Date } | undefined;

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      const sessionEnd = new Date(session.date!.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      if (now >= session.date! && now <= sessionEnd) {
        current = session.name;
        if (i + 1 < sessions.length) {
          next = { name: sessions[i + 1].name, date: sessions[i + 1].date! };
        }
        break;
      } else if (now < session.date!) {
        next = { name: session.name, date: session.date! };
        break;
      }
    }

    return { current, next };
  };

  useEffect(() => {
    fetchRaces();
    
    // Update every minute
    const interval = setInterval(() => {
      if (races.length > 0) {
        calculateProgress(races);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (races.length > 0) {
      calculateProgress(races);
    }
  }, [races]);

  return {
    races,
    raceProgress,
    seasonProgress,
    currentRace,
    nextRace,
    isLoading,
    error,
    refetch: fetchRaces,
  };
}
