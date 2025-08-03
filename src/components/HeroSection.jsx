function HeroSection(){
    return (
        <>
          {/* Hero Section */}
          <section className="relative h-[80vh] flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
          <img src="https://static.vecteezy.com/system/resources/previews/053/441/933/non_2x/yellow-ball-for-pickleball-sport-with-transparent-background-free-png.png" 
          alt="Pickleball" className="w-64 h-64 rounded-full animate-spin-slow" />
          <div className="bottom-10 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">The New Standard of Play.</h1>
              <p className="text-lg text-gray-600 mb-4">Discover our latest gear engineered for performance.</p>
              <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Shop All &gt;</button>
          </div>
      </section>
      </>    )
}

export default HeroSection;