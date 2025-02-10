"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface SolfegePadProps {
  notes: string[];
  onNoteClick: (note: string) => void;
  isPlaying: boolean;
  currentNote: string | null;
}

const colors = [
  "bg-red-500 hover:bg-red-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-green-500 hover:bg-green-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
];

const SolfegePad: React.FC<SolfegePadProps> = ({
  notes,
  onNoteClick,
  isPlaying,
  currentNote,
}) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    if (currentNote) {
      setActiveNote(currentNote);
      const timer = setTimeout(() => setActiveNote(null), 200);
      return () => clearTimeout(timer);
    }
  }, [currentNote]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-200 rounded-xl shadow-lg">
      {notes.map((note, index) => (
        <button
          key={note}
          onClick={() => onNoteClick(note)}
          disabled={isPlaying}
          className={`
            ${colors[index]} 
            w-24 h-24 
            rounded-full 
            text-white 
            font-bold 
            text-xl 
            shadow-lg 
            transition-transform 
            duration-100
            ${activeNote === note ? "scale-95 brightness-110" : "scale-100"}
            ${isPlaying ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            focus:outline-none 
            active:scale-95
          `}
        >
          {note}
        </button>
      ))}
    </div>
  );
};

export default SolfegePad;
