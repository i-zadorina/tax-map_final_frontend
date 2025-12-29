// components/SearchPanel/SearchPanel.tsx
import React, { useState, useEffect, useRef } from "react";
import "./SearchPanel.css";

interface SearchPanelProps {
  query: string;
  setQuery: (value: string) => void;
  suggestions: string[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({ query, setQuery, suggestions }) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      setFiltered([]);
      setHighlightIndex(-1);
      return;
    }

    const matched = suggestions
      .filter((name) => name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);

    setFiltered(matched);
    setHighlightIndex(-1);
  }, [query, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const selected = filtered[highlightIndex];
      if (selected) {
        setQuery(selected);
        setShowDropdown(false);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="search-wrapper">
      <div className="input-with-clear">
        <input
          type="text"
          placeholder="Search country..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="country-search"
        />
        {query && (
          <button className="clear-button" onMouseDown={handleClear}>
            ×
          </button>
        )}
      </div>
      {showDropdown && filtered.length > 0 && (
        <ul className="autocomplete-list" ref={listRef}>
          {filtered.map((country, index) => (
            <li
              key={country}
              onMouseDown={() => setQuery(country)}
              className={index === highlightIndex ? "highlighted" : ""}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPanel;
