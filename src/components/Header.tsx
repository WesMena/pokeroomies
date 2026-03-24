export function Header() {
  return (
    <header className="w-full bg-[#0a0a0a] border-b-2 border-[#CC0000] px-6 py-4 flex items-center gap-4 mb-8">
      <img
        src="/pokeroomiesLogo.png"
        alt="Pokéroomies"
        className="h-12 w-auto object-contain"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div>
        <h1 className="text-[#FFDE00] font-pokemon text-lg leading-none tracking-tight">
          Pokéroomies
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Find your perfect Pokémon roommate
        </p>
      </div>
    </header>
  )
}
