// function HeroSection(){
//     return (
//         <>
//           {/* Hero Section */}
//           <section className="relative h-[80vh] flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
//           <img src="https://static.vecteezy.com/system/resources/previews/053/441/933/non_2x/yellow-ball-for-pickleball-sport-with-transparent-background-free-png.png" 
//           alt="Pickleball" className="w-64 h-64 rounded-full animate-spin-slow" />
//           <div className="bottom-10 text-center">
//               <h1 className="text-5xl font-bold text-gray-900 mb-2">The New Standard of Play.</h1>
//               <p className="text-lg text-gray-600 mb-4">Discover our latest gear engineered for performance.</p>
//               <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Shop All &gt;</button>
//           </div>
//       </section>
//       </>    )
// }

// export default HeroSection;

// src/components/HeroSection.jsx

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { TextureLoader } from 'three';
import Marquee from 'react-fast-marquee';

// Component for the 3D ball
function InteractiveBall() {
  const meshRef = useRef();
  const texture = new TextureLoader().load('https://bigmoods.com/cdn/shop/products/BM-0001-6594.jpg?v=1682047068');

  // Rotate the ball on every frame to simulate a continuous spin
useFrame(() => {
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.x += 0.005;
    }
});

return (
    <Sphere args={[2, 64, 64]} ref={meshRef}>  // Increased size from 1 to 2
        <meshStandardMaterial map={texture} />
    </Sphere>
);
}

function HeroSection() {
    return (
        <section className="relative h-[50vh] flex flex-col justify-center items-center bg-black overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <Marquee>
                    <Canvas>
                        <ambientLight intensity={2} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <pointLight position={[-10, -10, -10]} />
                        <InteractiveBall />
                        <OrbitControls enablePan={true} enableZoom={false} />
                    </Canvas>
                </Marquee>
            </div>
            <div className="relative z-10 bottom-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">The New Standard of Play.</h1>
                <p className="text-lg text-gray-300 mb-2 px-1">Discover our latest gear engineered for performance.</p>
                <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Shop All &gt;</button>
            </div>
            
        </section>
    );
}

export default HeroSection;