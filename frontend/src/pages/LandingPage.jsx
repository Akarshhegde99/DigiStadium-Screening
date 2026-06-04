import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { ChevronRight, Calendar, Clock } from 'lucide-react';

export default function LandingPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${API_URL}/matches`, { timeout: 5000 });
        if (response.data && response.data.length > 0) {
            setMatches(response.data);
        } else {
            throw new Error("Empty matches array");
        }
      } catch (error) {
        console.warn("Using fallback local match data because backend is unreachable or empty.");
        // Fallback Data based on the user's uploaded poster exactly
        setMatches([
            { id: 1, team1: "LSG", team2: "RCB", matchDate: "2026-04-15", matchTime: "19:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 2, team1: "RCB", team2: "DC", matchDate: "2026-04-18", matchTime: "15:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 3, team1: "RCB", team2: "GT", matchDate: "2026-04-24", matchTime: "19:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 4, team1: "DC", team2: "RCB", matchDate: "2026-04-27", matchTime: "19:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 5, team1: "GT", team2: "RCB", matchDate: "2026-04-30", matchTime: "19:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 6, team1: "LSG", team2: "RCB", matchDate: "2026-05-07", matchTime: "19:30:00", posterUrl: "/rcb-poster.jpg" },
            { id: 7, team1: "IND", team2: "IRE", matchDate: "2026-06-26", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 8, team1: "IND", team2: "IRE", matchDate: "2026-06-28", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 9, team1: "IND", team2: "ENG", matchDate: "2026-07-01", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 10, team1: "IND", team2: "ENG", matchDate: "2026-07-04", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 11, team1: "IND", team2: "ENG", matchDate: "2026-07-07", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 12, team1: "IND", team2: "ENG", matchDate: "2026-07-09", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 13, team1: "IND", team2: "ENG", matchDate: "2026-07-11", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 14, team1: "IND", team2: "ZIM", matchDate: "2026-07-23", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 15, team1: "IND", team2: "ZIM", matchDate: "2026-07-25", matchTime: "19:30:00", posterUrl: "/india-poster.png" },
            { id: 16, team1: "IND", team2: "ZIM", matchDate: "2026-07-26", matchTime: "19:30:00", posterUrl: "/india-poster.png" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const upcomingMatches = matches.filter((match) => {
    const isPastMatch = new Date(`${match.matchDate}T${match.matchTime || '00:00:00'}`) < new Date();
    return match.status === 'UPCOMING' && !isPastMatch;
  });

  const completedMatches = matches.filter((match) => {
    const isPastMatch = new Date(`${match.matchDate}T${match.matchTime || '00:00:00'}`) < new Date();
    return match.status === 'COMPLETED' || isPastMatch;
  });

  return (
    <div className="flex flex-col space-y-12 py-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Experience Cricket Like <span className="text-hcRed">Never Before</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Join us at Harvey's Cafe for exclusive live screenings of the biggest Team India matches. 
          Book your tables now!
        </p>
      </div>

      {/* Upcoming Screenings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center">
          <div className="w-2 h-8 bg-hcRed mr-3 rounded-full animate-pulse"></div>
          Upcoming Screenings
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hcRed"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto space-x-6 pb-6 pt-2 hide-scrollbar px-2">
            {upcomingMatches.map((match) => (
              <div 
                key={match.id} 
                className="glass-card min-w-[320px] md:min-w-[400px] flex-shrink-0 group overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-hcRed/5"
              >
                <div 
                  className="h-48 md:h-56 w-full relative overflow-hidden bg-black/50 cursor-pointer"
                  onClick={() => navigate(`/book/${match.id}`)}
                >
                  <img 
                    src={match.posterUrl || '/rcb-poster.jpg'}
                    alt="Match Poster" 
                    onError={(e) => { e.currentTarget.src = `https://fakeimg.pl/600x400/990000/fff/?text=${match.team1}+vs+${match.team2}`; }}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-2xl font-bold">
                      {match.team1} <span className="text-hcGold text-sm mx-1">VS</span> {match.team2}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-300 text-sm">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-hcRed" /> {new Date(match.matchDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-hcRed" /> {match.matchTime && match.matchTime.substring(0, 5)}</div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/book/${match.id}`)}
                    className="w-full py-3 rounded-lg font-semibold flex justify-center items-center transition-all btn-primary"
                  >
                    Book Table (₹499)
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
            
            {upcomingMatches.length === 0 && (
              <div className="text-center text-gray-500 w-full py-10">No upcoming screenings scheduled. Check back soon!</div>
            )}
          </div>
        )}
      </div>

      {/* Completed Screenings */}
      <div className="space-y-6 opacity-80">
        <h2 className="text-2xl font-bold flex items-center text-gray-300">
          <div className="w-2 h-8 bg-gray-500 mr-3 rounded-full"></div>
          Completed Screenings
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto space-x-6 pb-6 pt-2 hide-scrollbar px-2">
            {completedMatches.map((match) => (
              <div 
                key={match.id} 
                className="glass-card min-w-[320px] md:min-w-[400px] flex-shrink-0 group overflow-hidden border border-white/5 opacity-60 bg-black/20"
              >
                <div className="h-48 md:h-56 w-full relative overflow-hidden bg-black/70">
                  <img 
                    src={match.posterUrl || '/rcb-poster.jpg'}
                    alt="Match Poster" 
                    onError={(e) => { e.currentTarget.src = `https://fakeimg.pl/600x400/990000/fff/?text=${match.team1}+vs+${match.team2}`; }}
                    className="object-cover w-full h-full filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-2xl font-bold text-gray-400">
                      {match.team1} <span className="text-gray-500 text-sm mx-1">VS</span> {match.team2}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-500" /> {new Date(match.matchDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-gray-500" /> {match.matchTime && match.matchTime.substring(0, 5)}</div>
                  </div>
                  
                  <button 
                    disabled
                    className="w-full py-3 rounded-lg font-semibold flex justify-center items-center transition-all bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                  >
                    Match Completed
                  </button>
                </div>
              </div>
            ))}
            
            {completedMatches.length === 0 && (
              <div className="text-center text-gray-500 w-full py-10">No completed matches.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
