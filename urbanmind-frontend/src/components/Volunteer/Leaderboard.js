// src/components/Volunteer/Leaderboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import profileService from "../../services/profileService";
import { Award, Star, CheckCircle, Trophy, Medal, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Theme logic - we can still use theme colors for dynamic values if needed,
  // or map them to Tailwind classes. For simplicity, we'll try to map common themes.

  // Mock data
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all volunteers
        const data = await profileService.getAllProfiles("VOLUNTEER");

        // Process and map data
        const processed = data.map((v) => {
          const points =
            (v.problemsSolvedCount || 0) * 10 +
            (v.level || 0) * 50 +
            Math.round((v.ratingAverage || 0) * 20);
          return {
            id: v.id,
            user_id: v.id,
            name: v.fullName || v.username || "Volunteer",
            username: v.username || "user",
            level: v.level || 0,
            rating_average: v.ratingAverage || 0,
            rating_count: v.ratingCount || 0,
            problems_solved_count: v.problemsSolvedCount || 0,
            verification_status:
              v.verificationStatus?.toLowerCase() || "pending",
            avatar: (v.fullName || v.username || "U").charAt(0).toUpperCase(),
            points: points,
            isCurrentUser: v.id === user?.id,
          };
        });

        // Sort by Rating descending
        processed.sort((a, b) => b.rating_average - a.rating_average);

        // Keep only top 10
        const top10 = processed.slice(0, 10);

        // Assign rank
        const ranked = top10.map((v, i) => ({
          ...v,
          rank: i + 1,
        }));

        setVolunteers(ranked);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  // Find current user stats from the ranked list
  const currentUserStats = volunteers.find((v) => v.isCurrentUser) || {
    rank: "-",
    points: 0,
    problems_solved_count: 0,
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) {
      return (
        <div className="relative flex items-center justify-center w-12 h-12">
          <Trophy
            className="w-10 h-10 text-yellow-500 drop-shadow-md"
            fill="#eab308"
          />
          <span className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-yellow-200">
            1
          </span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative flex items-center justify-center w-12 h-12">
          <Medal
            className="w-9 h-9 text-gray-400 drop-shadow-md"
            fill="#9ca3af"
          />
          <span className="absolute -top-1 -right-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-gray-200">
            2
          </span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative flex items-center justify-center w-12 h-12">
          <Medal
            className="w-9 h-9 text-orange-400 drop-shadow-md"
            fill="#fb923c"
          />
          <span className="absolute -top-1 -right-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-orange-200">
            3
          </span>
        </div>
      );
    }
    return (
      <span className="text-xl font-bold text-gray-500 w-12 text-center">
        #{rank}
      </span>
    );
  };

  const getRowStyle = (rank, isCurrentUser) => {
    const baseClass =
      "grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 p-5 border-b border-gray-100 items-center transition-all duration-200 cursor-pointer";

    if (isCurrentUser)
      return `${baseClass} bg-[rgb(179,23,75)]/5 hover:bg-[rgb(179,23,75)]/10 border-[rgb(179,23,75)]/20`;
    if (rank === 1) return `${baseClass} bg-yellow-50/40 hover:bg-yellow-50/70`;
    if (rank === 2) return `${baseClass} bg-gray-50/50 hover:bg-gray-100/50`;
    if (rank === 3) return `${baseClass} bg-orange-50/40 hover:bg-orange-50/70`;

    return `${baseClass} hover:bg-gray-50 bg-white`;
  };

  return (
    <ResponsiveLayout fullWidth={true} showRightSidebar={false}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-[rgb(179,23,75)]" />
            Volunteer Leaderboard
          </h1>
          <p className="text-gray-500 text-base">
            Recognizing our top contributors making a difference in the
            community
          </p>
        </div>

        {/* Current User Stats (Mobile Highlight) */}
        <div className="bg-white rounded-2xl p-6 mb-8 flex justify-around items-center flex-wrap gap-4 border border-[rgb(179,23,75)]/20 shadow-lg shadow-[rgb(179,23,75)]/5">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Your Rank
            </div>
            <div className="text-3xl font-extrabold text-[rgb(179,23,75)]">
              #{currentUserStats.rank}
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Points</div>
            <div className="text-3xl font-extrabold text-[rgb(179,23,75)]">
              {currentUserStats.points}
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500 mb-1">Solved</div>
            <div className="text-3xl font-extrabold text-[rgb(179,23,75)]">
              {currentUserStats.problems_solved_count}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-500 text-sm uppercase tracking-wider">
            <div className="text-center">Rank</div>
            <div>Volunteer</div>
            <div>Level</div>
            <div>Rating</div>
            <div className="text-right">Problems Solved</div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-gray-100">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className={getRowStyle(
                  volunteer.rank,
                  volunteer.isCurrentUser,
                ).replace("p-5", "p-3 md:p-5")}
                onClick={() => navigate(`/u/${volunteer.user_id}`)}
              >
                {/* Rank */}
                <div className="flex items-center justify-center md:justify-center mb-2 md:mb-0">
                  {getRankDisplay(volunteer.rank)}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div
                    className={`
                                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-sm shrink-0
                                        ${
                                          volunteer.rank === 1
                                            ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-400 to-yellow-600"
                                            : volunteer.rank === 2
                                              ? "ring-2 ring-gray-300 bg-gradient-to-br from-gray-400 to-gray-600"
                                              : volunteer.rank === 3
                                                ? "ring-2 ring-orange-300 bg-gradient-to-br from-orange-400 to-orange-600"
                                                : "bg-gradient-to-br from-[rgb(179,23,75)] to-[rgb(150,20,60)]"
                                        }
                                    `}
                  >
                    {volunteer.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 flex items-center gap-2 flex-wrap text-sm md:text-base">
                      <span className="truncate">{volunteer.name}</span>
                      {volunteer.isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-[rgb(179,23,75)] text-white text-[10px] md:text-xs font-semibold">
                          You
                        </span>
                      )}
                      {volunteer.verification_status === "verified" && (
                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 fill-green-500/10" />
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 truncate">
                      @{volunteer.username}
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div className="flex justify-center md:justify-start">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-gray-100 text-gray-800 text-xs md:text-sm font-semibold border border-gray-200">
                    <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-[rgb(179,23,75)] fill-[rgb(179,23,75)]" />
                    Lvl {volunteer.level}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center md:justify-start">
                  <div className="flex items-baseline gap-1.5">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900 text-sm md:text-base">
                      {volunteer.rating_average}
                    </span>
                    <span className="text-[10px] md:text-xs text-gray-400">
                      ({volunteer.rating_count})
                    </span>
                  </div>
                </div>

                {/* Problems Solved */}
                <div className="flex justify-center md:justify-end items-center gap-2 md:gap-1">
                  <span className="md:hidden text-xs text-gray-500">
                    Solved:
                  </span>
                  <div className="text-[rgb(179,23,75)] font-bold text-base md:text-lg">
                    {volunteer.problems_solved_count}
                    <span className="text-xs text-gray-400 font-normal ml-1 hidden md:inline">
                      solved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Leaderboard;
