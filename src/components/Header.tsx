export function Header() {
  return (
    <header className="w-full bg-[#0a0a0a] border-b-2 border-[#CC0000] px-6 py-4 flex items-center justify-center mb-8">
      <img
        src="/pokeroomiesLogo.png"
        alt="Pokéroomies"
        className="h-24 w-auto object-contain"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </header>
  )
}
