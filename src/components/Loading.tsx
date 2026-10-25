function Loading() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-sm text-neutral-400 font-medium">
          Loading please wait
        </p>
      </div>
    </div>
  );
}

export default Loading;

