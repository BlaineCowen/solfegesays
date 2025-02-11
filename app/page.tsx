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

  // // when score changes, update delay
  // useEffect(() => {
  //   // decrease delay on a curve min 10ms
  //   setDelay(Math.max(300 - score * 25, 10));
  // }, [score]);

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

    // Cancel any previous events and reset
    Tone.Transport.cancel();
    Tone.Transport.stop();
    Tone.Transport.position = 0;

    await Tone.start();
    Tone.Transport.bpm.value = Math.max(120 - score * 5, 60);

    let currentIndex = 0;
    const seq = new Tone.Sequence(
      (time: number, note: string | null) => {
        if (!note || !synthRef.current) return;

        // Play the current note
        synthRef.current.triggerAttackRelease(
          NOTE_FREQUENCIES[note],
          "8n",
          time
        );

        // Schedule visual feedback
        Tone.Draw.schedule(() => {
          setCurrentNote(note);
          setTimeout(() => setCurrentNote(null), 200);
        }, time);

        currentIndex++;
        // Stop sequence after last note
        if (currentIndex >= sequence.length) {
          seq.stop();
        }
      },
      sequence,
      "4n"
    ).start("+0.1");

    Tone.Transport.start();

    const noteDuration = (60 / Tone.Transport.bpm.value) * 1000;
    const totalDuration = sequence.length * noteDuration;

    setTimeout(() => {
      seq.dispose();
      Tone.Transport.stop();
      setIsPlaying(false);
    }, totalDuration + 200);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
      <h1 className="text-5xl font-bold mb-8 text-indigo-600 tracking-wide">
        Simon Solfege
      </h1>
      <div className="mb-8">
        <SolfegePad
          notes={NOTES}
          onNoteClick={handleNoteClick}
          isPlaying={isPlaying}
          currentNote={currentNote}
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
    </div>
  );
}
