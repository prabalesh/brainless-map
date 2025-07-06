import { useState } from "react";
import { searchImages, createQuestion } from "../services/api";

export default function QuestionCreate() {
  const [word, setWord] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const res = await searchImages(searchQuery);
    setSearchResults(res.data || []);
  };

  const toggleImage = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url)
        ? prev.filter((img) => img !== url)
        : prev.length < 4
        ? [...prev, url]
        : prev
    );
  };

  const handleSubmit = async () => {
    if (!word.trim()) {
      alert("Please enter a valid word.");
      return;
    }
    if (selectedImages.length < 2) {
      alert("Please select at least 2 images.");
      return;
    }

    await createQuestion(word.trim(), selectedImages);
    setWord("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedImages([]);
  };

  return (
    <div className="border p-4 rounded bg-white">
      <h3 className="text-lg font-bold mb-3">Create New Question</h3>

      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Answer Word (e.g. astronaut)"
      />

      <div className="flex items-center gap-2 mb-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Search images (e.g. astro, naut)"
        />
        <button
          onClick={fetchImages}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        Select 2 to 4 images ({selectedImages.length} selected)
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {searchResults.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            onClick={() => toggleImage(url)}
            className={`w-full h-28 object-cover rounded cursor-pointer border-4 transition ${
              selectedImages.includes(url) ? "border-purple-600" : "border-transparent"
            }`}
          />
        ))}
      </div>

      {selectedImages.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1">Selected Images:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Selected"
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!word.trim() || selectedImages.length < 2}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-purple-300"
      >
        Save Question
      </button>
    </div>
  );
}
