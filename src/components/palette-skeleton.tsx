export function PaletteSkeleton() {
  return (
    <div className="bg-white border-3 border-black shadow-brutal p-4 animate-pulse">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="h-6 w-48 bg-gray-200 border-2 border-black"></div>
          <div className="h-4 w-32 bg-gray-100 border-2 border-black"></div>
        </div>
        <div className="grid grid-cols-4 gap-2 self-start sm:flex">
          <div className="h-10 w-10 bg-gray-200 border-3 border-black"></div>
          <div className="h-10 w-10 bg-gray-200 border-3 border-black"></div>
          <div className="h-10 w-10 bg-gray-200 border-3 border-black"></div>
          <div className="h-10 w-10 bg-gray-200 border-3 border-black"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-24 bg-gray-200 border-3 border-black"></div>
        ))}
      </div>
    </div>
  )
}
