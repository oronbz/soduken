export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center">
      <div className="text-5xl mb-4">☁️</div>
      <h1 className="font-display text-2xl font-bold text-brown-dark mb-2">
        You&apos;re offline
      </h1>
      <p className="text-brown-light text-sm max-w-xs">
        It looks like you&apos;ve lost your connection. Don&apos;t worry — your progress is saved.
        Reconnect to continue playing.
      </p>
    </div>
  );
}
