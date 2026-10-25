import React, { useState } from 'react';
import { CoachProfile } from '../types';
import { ShieldCheck, Search, MapPin, Award, Star, Video, Home, Dumbbell, Filter } from 'lucide-react';

interface FindCoachPageProps {
  coaches: CoachProfile[];
  onBookCoach: (coach: CoachProfile) => void;
}

export const FindCoachPage: React.FC<FindCoachPageProps> = ({ coaches, onBookCoach }) => {
  const [searchCity, setSearchCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [modeFilter, setModeFilter] = useState<'All' | 'Home' | 'Online'>('All');

  const sportsList = ['All', 'Fitness Training', 'Yoga', 'Aerobics', 'Strength and Conditioning', 'Boxing', 'Karate', 'Taekwondo', 'Football', 'Badminton'];

  const filteredCoaches = coaches.filter(c => {
    const matchesCity = !searchCity || c.city.toLowerCase().includes(searchCity.toLowerCase()) || c.state.toLowerCase().includes(searchCity.toLowerCase());
    let matchesSport = true;
    if (selectedSport !== 'All') {
      try {
        const specs: string[] = JSON.parse(c.sports_specialisations);
        matchesSport = specs.some(s => s.toLowerCase().includes(selectedSport.toLowerCase()));
      } catch (e) {
        matchesSport = c.sports_specialisations.toLowerCase().includes(selectedSport.toLowerCase());
      }
    }
    const matchesMode = 
      modeFilter === 'All' ? true :
      modeFilter === 'Home' ? c.home_visit_available === 1 :
      c.online_available === 1;

    return matchesCity && matchesSport && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-lime-500/30 text-lime-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Coaches Directory</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          Find Verified Sports & Fitness Coaches
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
          Every coach on Parametric Play is thoroughly verified by our management team, audited for certified credentials, and company-managed. No unvetted freelancers.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-forest-900 border border-forest-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* City Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Delhi, Mumbai, Bengaluru)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-forest-950 border border-forest-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500"
            />
          </div>

          {/* Sport Category Filter */}
          <div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500"
            >
              {sportsList.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Sports & Disciplines' : s}</option>
              ))}
            </select>
          </div>

          {/* Training Mode Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModeFilter('All')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                modeFilter === 'All'
                  ? 'bg-lime-500 text-forest-950 border-lime-400 font-bold'
                  : 'bg-forest-950 text-slate-300 border-forest-750 hover:bg-forest-850'
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setModeFilter('Home')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                modeFilter === 'Home'
                  ? 'bg-lime-500 text-forest-950 border-lime-400 font-bold'
                  : 'bg-forest-950 text-slate-300 border-forest-750 hover:bg-forest-850'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Visit</span>
            </button>
            <button
              onClick={() => setModeFilter('Online')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                modeFilter === 'Online'
                  ? 'bg-lime-500 text-forest-950 border-lime-400 font-bold'
                  : 'bg-forest-950 text-slate-300 border-forest-750 hover:bg-forest-850'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Online</span>
            </button>
          </div>

        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCoaches.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-forest-950 rounded-3xl border border-forest-800">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-white">No Coaches Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We do not fabricate fake coach profiles. If your locality does not yet have active coaches, submit a location request on our Contact page!
            </p>
          </div>
        ) : (
          filteredCoaches.map((coach) => {
            let specs: string[] = [];
            try {
              specs = JSON.parse(coach.sports_specialisations);
            } catch (e) {
              specs = [coach.sports_specialisations];
            }

            return (
              <div 
                key={coach.id}
                className="bg-forest-900 border border-forest-800 rounded-3xl p-6 flex flex-col justify-between hover:border-lime-500/40 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-forest-800 border border-lime-500/30 flex items-center justify-center text-xl font-heading font-black text-lime-400 shadow-md">
                        {coach.photo_url ? (
                          <img src={coach.photo_url} alt={coach.full_name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          coach.full_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-white group-hover:text-lime-400 transition-colors">
                          {coach.full_name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-lime-400 shrink-0" />
                          <span>{coach.city}, {coach.state}</span>
                        </p>
                      </div>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  {/* Qualifications */}
                  <div className="p-3 bg-forest-950 rounded-xl border border-forest-850 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200 line-clamp-1">{coach.qualifications}</p>
                    <p className="text-[11px] text-slate-400">{coach.service_area}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {coach.bio}
                  </p>

                  {/* Sports tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {specs.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-forest-950 border border-forest-800 text-lime-400 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Bottom CTA */}
                <div className="mt-6 pt-4 border-t border-forest-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Experience</span>
                    <strong className="text-white">{coach.experience_years} Years</strong>
                  </div>

                  <button
                    onClick={() => onBookCoach(coach)}
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl transition-all shadow-md shadow-lime-500/15"
                  >
                    Book for ₹2,000/mo
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
