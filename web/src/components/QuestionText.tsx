import type { QuestionTextPart } from '../types';

interface QuestionTextProps {
  parts: QuestionTextPart[];
}

export function QuestionText({ parts }: QuestionTextProps) {
  return (
    <p className="text-balance">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else {
          return (
            <span key={index} className="font-bold text-teal">
              {part.cityName}, {part.countryName}
            </span>
          );
        }
      })}
    </p>
  );
}
