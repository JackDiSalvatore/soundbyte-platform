import type { SoundByteGenre } from "@/types/soundbyte.types";

type GenresSectionProps = {
  availableGenres: SoundByteGenre[] | null;
  selectedGenres: SoundByteGenre[];
  onGenreToggle: (genre: SoundByteGenre) => void;
};

export function GenresSection({
  availableGenres,
  selectedGenres,
  onGenreToggle,
}: GenresSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Favorite Genres
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Select the genres you're most interested in
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableGenres &&
          availableGenres.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenres.some((g) => g.id === genre.id)}
                onChange={() => onGenreToggle(genre)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{genre.name}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
