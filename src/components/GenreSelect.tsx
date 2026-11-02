import React from 'react';
import { Music2 } from 'lucide-react';

export interface GenreSelectProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  includeAllOption?: boolean;
  label?: string;
}

export const GenreSelect: React.FC<GenreSelectProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  includeAllOption = false,
  label = 'Select Genre',
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label
          htmlFor="genre-select"
          className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Music2 className="w-3.5 h-3.5 text-brand-400" />
          <span>{label}:</span>
        </label>
      )}
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onSelectGenre(e.target.value)}
        className="bg-slate-900 border border-slate-700 hover:border-brand-500/60 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 outline-none transition-colors cursor-pointer"
        aria-label="Filter analysis by music genre"
      >
        {includeAllOption && <option value="all">All Genres</option>}
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};
