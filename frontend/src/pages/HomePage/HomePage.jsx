import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section className="min-h-screen bg-neutral-900 flex items-center">
      <div className="mx-auto max-w-3xl px-6 text-center text-gray-100">
        {/* hero title */}
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Welcome to <span className="text-emerald-400">Check-Point</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Discover, review, and track your favorite video games!
        </p>

        {/* primary actions */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/search"
            className="
              rounded-full bg-emerald-600 px-8 py-3 font-medium text-white
              transition hover:bg-emerald-500
            "
          >
            Search Games
          </Link>
          <Link
            to="/games"
            className="
              rounded-full border border-emerald-500 px-8 py-3 font-medium
              text-emerald-400 transition hover:bg-emerald-600 hover:text-white
            "
          >
            Browse List
          </Link>
        </div>

        {/* subtle background flourish */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
            from-emerald-600/10 via-transparent to-transparent
          "
        />
      </div>
    </section>
  );
}