import type { QuestionTextPart } from '../types';

interface QuestionTextProps {
  parts: QuestionTextPart[];
}

export function QuestionText({ parts }: QuestionTextProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else {
          // City with country in highlighted box
          return (
            <div
              key={index}
              className="inline-block bg-slate-200 rounded-lg px-3 py-1.5 font-semibold text-gray-900 whitespace-nowrap"
            >
              {part.cityName}, {part.countryName}
            </div>
          );
        }
      })}
    </div>
  );
}
