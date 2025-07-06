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
    <div className="container my-6 mx-auto px-4 py-8 max-w-6xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Create New Question</h3>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Answer Word</label>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none"
            placeholder="Enter the answer word (e.g. astronaut)"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Images</label>
          <div className="flex gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none"
              placeholder="Search for images (e.g. astro, naut)"
            />
            <button
              onClick={fetchImages}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Select 2 to 4 images
            </p>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {selectedImages.length} selected
            </span>
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6">
              {searchResults.map((url, i) => (
                <div
                  key={i}
                  onClick={() => toggleImage(url)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 aspect-square ${
                    selectedImages.includes(url) 
                      ? "ring-4 ring-purple-500 ring-offset-2 shadow-2xl transform scale-105 z-10" 
                      : "hover:shadow-xl hover:scale-102 shadow-md"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {selectedImages.includes(url) && (
                    <div className="absolute inset-0 bg-purple-600 bg-opacity-30 flex items-center justify-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">{i + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Selected Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedImages.map((url, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg ring-2 ring-purple-200 hover:ring-purple-400 transition-all duration-300">
                      <img
                        src={url}
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!word.trim() || selectedImages.length < 2}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            !word.trim() || selectedImages.length < 2
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          }`}
        >
          {!word.trim() || selectedImages.length < 2 ? "Complete all fields to save" : "Save Question"}
        </button>
      </div>
    </div>
  );
}