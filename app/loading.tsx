export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-black border-t-green-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Loading...</p>
      </div>
    </div>
  )
}
