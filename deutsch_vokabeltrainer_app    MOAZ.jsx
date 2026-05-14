import { useEffect, useMemo, useState } from "react"

export default function DeutschVokabeltrainer() {
  const [input, setInput] = useState("")
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [repeatCount, setRepeatCount] = useState(2)
  const [quizWord, setQuizWord] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(1)

  const currentWord = words[currentIndex] || "Willkommen"

  const speakWord = (word: string) => {
    if (!word) return

    speechSynthesis.cancel()

    for (let i = 0; i < repeatCount; i++) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = "de-DE"
      utterance.volume = 1
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const loadWords = () => {
    const cleanWords = input
      .split("
")
      .map((w) => w.trim())
      .filter(Boolean)

    setWords(cleanWords)
    setCurrentIndex(0)

    if (cleanWords.length > 0) {
      setTimeout(() => speakWord(cleanWords[0]), 300)
    }
  }

  const nextWord = () => {
    if (words.length === 0) return

    const next = (currentIndex + 1) % words.length
    setCurrentIndex(next)
    speakWord(words[next])
  }

  const previousWord = () => {
    if (words.length === 0) return

    const prev = currentIndex === 0 ? words.length - 1 : currentIndex - 1
    setCurrentIndex(prev)
    speakWord(words[prev])
  }

  useEffect(() => {
    if (!autoPlay || words.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % words.length
        speakWord(words[next])
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, words, repeatCount])

  const createQuiz = () => {
    if (words.length < 4) return

    const randomWord = words[Math.floor(Math.random() * words.length)]

    const shuffled = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    if (!shuffled.includes(randomWord)) {
      shuffled[Math.floor(Math.random() * shuffled.length)] = randomWord
    }

    const finalOptions = shuffled.sort(() => Math.random() - 0.5)

    setQuizWord(randomWord)
    setOptions(finalOptions)

    setTimeout(() => {
      speakWord(randomWord)
    }, 500)
  }

  useEffect(() => {
    if (words.length >= 4) {
      createQuiz()
    }
  }, [words])

  const checkAnswer = (answer: string) => {
    if (answer === quizWord) {
      setScore((s) => s + 1)
    }

    setQuestion((q) => q + 1)
    createQuiz()
  }

  const progress = useMemo(() => {
    if (words.length === 0) return 0
    return ((currentIndex + 1) / words.length) * 100
  }, [currentIndex, words])

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
             Deutsch Lernen DKW Moaz 
          </h1>

          <p className="text-neutral-400 text-lg">
            Hören • Lernen • Wiederholen • Prüfung
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-2xl">
            <h2 className="text-3xl font-bold mb-5">Wörterliste</h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="lernen
sprechen
verstehen
arbeiten"
              className="w-full h-72 bg-black border border-neutral-700 rounded-2xl p-5 text-xl focus:outline-none focus:ring-2 focus:ring-white"
            />

            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <button
                onClick={loadWords}
                className="bg-white text-black font-bold py-4 rounded-2xl text-lg hover:scale-105 transition"
              >
                Wörter laden
              </button>

              <button
                onClick={() => speakWord(currentWord)}
                className="bg-neutral-800 py-4 rounded-2xl text-lg hover:bg-neutral-700 transition"
              >
                🔊 Aktuelles Wort
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-2xl space-y-5">
            <div>
              <p className="text-neutral-400 mb-2">Aktuelles Wort</p>
              <h2 className="text-5xl md:text-7xl font-black break-words">
                {currentWord}
              </h2>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={previousWord}
                className="bg-neutral-800 py-4 rounded-2xl hover:bg-neutral-700 transition"
              >
                ⬅ Zurück
              </button>

              <button
                onClick={() => speakWord(currentWord)}
                className="bg-white text-black font-black py-4 rounded-2xl hover:scale-105 transition"
              >
                ▶ Hören
              </button>

              <button
                onClick={nextWord}
                className="bg-neutral-800 py-4 rounded-2xl hover:bg-neutral-700 transition"
              >
                Weiter ➜
              </button>
            </div>

            <div className="bg-black rounded-3xl p-5 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg">Automatisch abspielen</span>

                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={() => setAutoPlay(!autoPlay)}
                  className="scale-150"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">Wiederholung</span>
                  <span className="font-bold text-2xl">{repeatCount}×</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-black">Hörtest</h2>
              <p className="text-neutral-400 mt-1">
                Höre das Wort und wähle die richtige Antwort.
              </p>
            </div>

            <div className="bg-black rounded-2xl px-5 py-3 border border-neutral-800">
              <p className="text-neutral-400 text-sm">Punkte</p>
              <h3 className="text-3xl font-black">{score}</h3>
            </div>
          </div>

          <div className="bg-black rounded-3xl p-6 border border-neutral-800">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <p className="text-neutral-400">Frage {question}</p>
                <h3 className="text-3xl font-bold mt-1">
                  Welches Wort hörst du?
                </h3>
              </div>

              <button
                onClick={() => speakWord(quizWord)}
                className="bg-white text-black px-6 py-4 rounded-2xl font-black hover:scale-105 transition"
              >
                🔊 Audio
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => checkAnswer(option)}
                  className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 text-left text-xl hover:border-white hover:scale-[1.02] transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
            <p className="text-neutral-400 mb-2">Geladene Wörter</p>
            <h3 className="text-5xl font-black">{words.length}</h3>
          </div>

          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
            <p className="text-neutral-400 mb-2">Aktuelles Wort</p>
            <h3 className="text-5xl font-black">{currentIndex + 1}</h3>
          </div>

          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800">
            <p className="text-neutral-400 mb-2">Lernen</p>
            <h3 className="text-5xl font-black">A1</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
