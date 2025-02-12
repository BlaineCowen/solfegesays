"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import SolfegePad from "./components/SolfegePad";
import * as Tone from "tone";

const NOTES = ["Do", "Re", "Mi", "Fa", "So", "La", "Ti", "Do'"];
// Map solfege notes to frequencies
const NOTE_FREQUENCIES: Record<string, number> = {
  Do: 261.63, // C4
  Re: 293.66, // D4
  Mi: 329.63, // E4
  Fa: 349.23, // F4
  So: 392.0, // G4
  La: 440.0, // A4
  Ti: 493.88, // B4
  "Do'": 523.25, // C5
};

export default function SimonSolfege() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  // const [delay, setDelay] = useState(300);
  const synthRef = useRef<Tone.Synth | null>(null);
  const [isHardMode, setIsHardMode] = useState(false);
  const [displaySeq, setDisplaySeq] = useState<string[]>([]);
  // Initialize synth once
  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1,
      },
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playNote = useCallback((note: string) => {
    if (!synthRef.current) return;
    setCurrentNote(note);
    synthRef.current.triggerAttackRelease(NOTE_FREQUENCIES[note], "8n");
    setTimeout(() => setCurrentNote(null), 300);
  }, []);

  const addToSequence = useCallback(() => {
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    const lastNote = sequence[sequence.length - 1];
    let newNote: string;
    do {
      newNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    } while (newNote === lastNote && NOTES.length > 1);

    setSequence((prev) => [...prev, newNote]);
  }, [sequence]);

  const playSequence = useCallback(async () => {
    if (!synthRef.current || !sequence.length) return;
    setIsPlaying(true);

    // Clear previous events
    Tone.Transport.cancel();
    Tone.Transport.stop();
    Tone.Transport.position = 0;

    await Tone.start();

    // Create sequence with dynamic speed
    const seq = new Tone.Sequence(
      (time, note) => {
        synthRef.current?.triggerAttackRelease(
          NOTE_FREQUENCIES[note],
          "8n",
          time
        );

        Tone.Draw.schedule(() => {
          setCurrentNote(note);
          Tone.Draw.schedule(() => setCurrentNote(null), time + 0.2);
        }, time);
      },
      sequence,
      "4n"
    );

    // Set playback rate based on score (exponential speed increase)
    const baseSpeed = 1;
    const speedMultiplier = 1 + Math.log(score + 1) / 2;
    seq.playbackRate = Math.min(baseSpeed * speedMultiplier, 2.5);
    seq.loop = false;

    // Start sequence
    seq.start(0);
    Tone.Transport.start();

    // Calculate duration
    const noteDuration = Tone.Time("4n").toSeconds() / seq.playbackRate;
    const totalDuration = sequence.length * noteDuration;

    // Cleanup
    setTimeout(() => {
      seq.dispose();
      Tone.Transport.stop();
      setIsPlaying(false);
    }, totalDuration * 1000 + 200);
  }, [sequence, score]);

  const handleNoteClick = useCallback(
    (note: string) => {
      if (isPlaying) return;
      playNote(note);
      setPlayerSequence((prev) => [...prev, note]);
    },
    [isPlaying, playNote]
  );

  useEffect(() => {
    if (sequence.length) {
      playSequence();
    }
  }, [sequence]);

  useEffect(() => {
    if (playerSequence.length) {
      const currentIndex = playerSequence.length - 1;
      if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        alert(`Game Over! Your score: ${score}`);
        setDisplaySeq(sequence);
        setSequence([]);
        setPlayerSequence([]);
        setScore(0);
      } else if (playerSequence.length === sequence.length) {
        setScore((s) => s + 1);
        setPlayerSequence([]);
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    }
  }, [playerSequence, sequence, score, addToSequence]);

  const playReferenceNote = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttackRelease(NOTE_FREQUENCIES["Do"], "8n");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
      <h1 className="text-5xl font-bold mb-8 text-indigo-600 tracking-wide">
        Simon Solfege
      </h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsHardMode(!isHardMode)}
          className={`px-4 py-2 rounded-lg shadow-lg transition duration-300 focus:outline-none focus:ring-4 ${
            isHardMode
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-400"
              : "bg-green-600 hover:bg-green-700 focus:ring-green-400"
          } text-white`}
        >
          {isHardMode ? "Hard Mode" : "Easy Mode"}
        </button>
        <button
          onClick={playReferenceNote}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          Play Do
        </button>
      </div>
      <div className="mb-8">
        <SolfegePad
          notes={NOTES}
          onNoteClick={handleNoteClick}
          isPlaying={isPlaying}
          currentNote={isHardMode ? null : currentNote}
        />
      </div>
      <div className="text-3xl font-semibold mb-6 text-indigo-800">
        Score: {score}
      </div>
      {!sequence.length && (
        <button
          onClick={addToSequence}
          className="px-8 py-4 bg-indigo-600 text-white text-xl rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
        >
          Start Game
        </button>
      )}
      {displaySeq.length > 0 && (
        <div className="text-3xl font-semibold mb-6 text-indigo-800">
          Correct Sequence: {displaySeq.join(", ")}
        </div>
      )}
    </div>
  );
}
