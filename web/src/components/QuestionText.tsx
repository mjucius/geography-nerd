import type { QuestionTextPart } from '../types';

interface QuestionTextProps {
  parts: QuestionTextPart[];
}

export function QuestionText({ parts }: QuestionTextProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else {
          return (
            <span key={index} className="max-w-full font-bold text-teal">
              {part.cityName}, {part.countryName}
            </span>
          );
        }
      })}
    </div>
  );
}
