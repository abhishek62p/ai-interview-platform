import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image";
import React from "react";
import { getLeaderboardData } from "@/app/dashboard/actions";
import { Crown, User } from "lucide-react";

export default async function LeaderBoard() {
  const { topUsers, currentUser } = await getLeaderboardData();

  const rankDetails = [
    {
      color: "bg-amber-400",
      shadow: "shadow-amber-500/50",
      text: "text-amber-900",
      rank: "1st",
    },
    {
      color: "bg-slate-300",
      shadow: "shadow-slate-400/50",
      text: "text-slate-800",
      rank: "2nd",
    },
    {
      color: "bg-orange-400",
      shadow: "shadow-orange-500/50",
      text: "text-orange-900",
      rank: "3rd",
    },
  ];

  // Pad data if fewer than 3 users
  while (topUsers.length < 3) {
    topUsers.push({ name: "N/A", score: 0, image: null, id: "" });
  }

  return (
    <Card className="flex z-10 flex-col min-w-2xs min-h-[380px] h-full bg-white/60 rounded-4xl select-none p-6">
      <CardHeader className="items-center p-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Crown className="text-amber-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div
              key={user.id || index}
              className="flex items-center bg-white/50 p-3 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 duration-500"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${rankDetails[index].color} ${rankDetails[index].text} shadow-lg ${rankDetails[index].shadow}`}
              >
                {index + 1}
              </div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User className="text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold truncate">{user.name}</p>
              </div>
              <div className="font-bold text-lg">{user.score}</div>
            </div>
          ))}
        </div>

        {currentUser && currentUser.rank > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-dashed border-black/10">
            <p className="text-center text-sm font-semibold mb-2">Your Rank</p>
            <div className="flex items-center bg-indigo-100 p-3 rounded-2xl shadow-inner">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 bg-indigo-500 text-white`}
              >
                {currentUser.rank}
              </div>
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name || "You"}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User className="text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold truncate">{currentUser.name}</p>
              </div>
              <div className="font-bold text-lg">{currentUser.score}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
