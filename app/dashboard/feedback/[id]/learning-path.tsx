"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  BookOpen,
  Zap,
  Youtube,
  FileText,
  Book,
  ExternalLink,
} from "lucide-react";

interface LearningResource {
  topic: string;
  resourceType: "video" | "article" | "docs";
  resourceTitle: string;
  resourceUrl: string;
}

interface PersonalizedLearningPathProps {
  topics: LearningResource[];
}

const PersonalizedLearningPath: React.FC<PersonalizedLearningPathProps> = ({
  topics,
}) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case "article":
        return <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case "docs":
        return <Book className="w-5 h-5 text-green-600 flex-shrink-0" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
  };

  if (!topics || topics.length === 0) {
    return null; // Don't render the component if there are no topics
  }

  return (
    <Card className="bg-white/70 border border-black/10 shadow-lg backdrop-blur-md">
      <CardHeader className="pb-3 space-y-2">
        <CardTitle className="text-2xl font-bold text-dark flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm ring-1 ring-black/5">
            <Zap className="w-6 h-6 text-dark/80" />
          </div>
          Personalized Learning Path
        </CardTitle>
        <p className="text-dark/70 text-sm max-w-2xl">
          Curated resources to accelerate improvement in weaker areas identified by the AI analysis.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((item, index) => (
            <a
              key={index}
              href={item.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-3 p-5 bg-white/60 rounded-2xl border border-black/10 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all"
            >
              <div className="flex items-center gap-3">
                {getIconForType(item.resourceType)}
                <h4 className="font-semibold text-dark text-sm line-clamp-1 group-hover:text-indigo-600">
                  {item.topic}
                </h4>
              </div>
              <p className="text-xs text-dark/70 line-clamp-2 group-hover:underline">
                {item.resourceTitle}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-black/5 text-dark/50">
                  {item.resourceType}
                </span>
                <ExternalLink className="w-4 h-4 text-dark/40 group-hover:text-indigo-600" />
              </div>
              <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-indigo-200/60 transition" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedLearningPath;
