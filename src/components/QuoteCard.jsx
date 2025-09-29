import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

const defaultQuotes = [
  { id: 1, text: "Believe in yourself, and you're halfway there." },
  { id: 2, text: "Small steps every day lead to big changes." },
  { id: 3, text: "Dream big. Start small. Act now." },
  { id: 4, text: "Discipline is the bridge between goals and accomplishment." },
  { id: 5, text: "Your only limit is your mind." },
]

// Swipe animation variants (move outside component for performance)
const swipeVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
}

const QuotesCarousel = () => {
  const [quotes, setQuotes] = useState(defaultQuotes)
  const [index, setIndex] = useState(0)

  // Auto-rotate every 8 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length)
    }, 28800000)
    return () => clearInterval(interval)
  }, [quotes.length])

  const currentQuote = useMemo(
    () => quotes[index % quotes.length],
    [index, quotes]
  )

  const swipeTo = (dir) => setIndex((prev) => (prev + dir + quotes.length) % quotes.length)

  if (!quotes.length) return <p className="text-gray-400">Loading quotes...</p>

  return (
    <div className="relative w-80 max-w-full sm:w-72 h-96 mx-auto">
      {/* Quote Card */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            custom={1}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) swipeTo(-1)
              else if (offset.x < -100) swipeTo(1)
            }}
            className="w-full h-full p-8 flex flex-col justify-center items-center text-center 
              rounded-3xl shadow-xl border border-white/10
              bg-gradient-to-br from-indigo-300 via-indigo-400 to-indigo-500
              dark:from-indigo-900 dark:via-indigo-800 dark:to-purple-900
              backdrop-blur-xl text-gray-800 dark:text-white relative overflow-hidden"
          >
            {/* Decorative quote marks */}
            <div className="absolute top-4 left-6 text-6xl text-white/20 font-serif">"</div>
            <div className="absolute bottom-4 right-6 text-6xl text-white/20 font-serif rotate-180">"</div>

            {/* Main quote */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full">
              <p className="text-lg font-medium leading-relaxed mb-4 px-2">{currentQuote.text}</p>
            </div>

            {/* Subtle overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {quotes.map((_, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-label={`Go to quote ${i + 1}`}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => e.key === "Enter" && setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === index
                ? "bg-indigo-400 w-8"
                : "bg-gray-400 w-2 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default QuotesCarousel
