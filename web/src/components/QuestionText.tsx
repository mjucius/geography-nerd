import type { QuestionTextPart } from '../types';

interface QuestionTextProps {
  parts: QuestionTextPart[];
}

export function QuestionText({ parts }: QuestionTextProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else {
          return (
            <div
              key={index}
              className="inline-block max-w-full rounded-lg border border-[#d8cdb9] bg-[#fffaf0] px-2.5 py-1.5 font-black text-[#17202a] sm:px-3"
            >
              {part.cityName}, {part.countryName}
            </div>
          );
        }
      })}
    </div>
  );
}
