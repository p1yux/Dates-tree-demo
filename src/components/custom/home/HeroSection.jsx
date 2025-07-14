"use client"

import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { MeshStandardMaterial } from 'three'

// Sample city data - replace with your actual data
const cityData = [
  { name: 'Tunis', purchased: 75, color: '#ff6b6b' },
  { name: 'Sfax', purchased: 60, color: '#4ecdc4' },
  { name: 'Sousse', purchased: 80, color: '#45b7d1' },
  { name: 'Ettadhamen', purchased: 55, color: '#f9ca24' },
  { name: 'Kairouan', purchased: 70, color: '#f0932b' },
  { name: 'Gabès', purchased: 45, color: '#eb4d4b' },
  { name: 'Bizerte', purchased: 65, color: '#6c5ce7' },
  { name: 'Ariana', purchased: 50, color: '#a29bfe' },
  { name: 'Gafsa', purchased: 40, color: '#fd79a8' },
  { name: 'Monastir', purchased: 35, color: '#00b894' },
  { name: 'Médenine', purchased: 30, color: '#00cec9' },
  { name: 'Tataouine', purchased: 25, color: '#fdcb6e' },
  { name: 'La Marsa', purchased: 20, color: '#e17055' },
  { name: 'El Kef', purchased: 15, color: '#81ecec' },
  { name: 'Mahdia', purchased: 10, color: '#ffeaa7' },
  { name: 'Zarzis', purchased: 85, color: '#fab1a0' },
  { name: 'Kasserine', purchased: 90, color: '#ff7675' },
  { name: 'Ben Arous', purchased: 55, color: '#74b9ff' },
  { name: 'Jendouba', purchased: 60, color: '#00b894' },
  { name: 'Tozeur', purchased: 45, color: '#fdcb6e' },
  { name: 'Nabeul', purchased: 50, color: '#e84393' },
  { name: 'Siliana', purchased: 40, color: '#00cec9' },
  { name: 'Beja', purchased: 35, color: '#6c5ce7' },
  { name: 'Manouba', purchased: 30, color: '#fd79a8' }
]

// Individual Date (Khajoor) Component
function DateFruit({ position, cityIndex, dateIndex, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  const city = cityData[cityIndex]
  const fillPercentage = city.purchased / 100
  
  // Create date material with realistic brown color and gradient
  const material = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    
    // Create gradient from purchased to unpurchased
    const gradient = ctx.createLinearGradient(0, 0, 0, 32)
    gradient.addColorStop(0, '#c68642') // Lighter brown
    gradient.addColorStop(fillPercentage, city.color) // City color for purchased portion
    gradient.addColorStop(fillPercentage, '#8B5C2A') // Rich brown for unpurchased
    gradient.addColorStop(1, '#5C3317') // Dark brown
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    
    const texture = new THREE.CanvasTexture(canvas)
    const mat = new MeshStandardMaterial({ 
      map: texture, 
      roughness: 0.6, 
      metalness: 0.15,
      shadowSide: THREE.FrontSide
    })
    return mat
  }, [fillPercentage, city.color])

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying motion
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + dateIndex) * 0.1
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3 + dateIndex) * 0.05
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? [1.4, 1.4, 1] : [1, 2, 1]}
      material={material}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(cityIndex, dateIndex)
      }}
    >
      <sphereGeometry args={[0.06, 8, 8]} />
    </mesh>
  )
}

// Palm Frond Component - More realistic
function PalmFrond({ branchIndex, onClick }) {
  const frondRef = useRef()
  const city = cityData[branchIndex]
  
  // Fronds start at y=0 (top of trunk sphere), for perfect connection
  const angle = (branchIndex / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.07
  const frondLength = 4.2 + Math.sin(branchIndex) * 0.4 + Math.random() * 0.18
  // More natural, drooping frond curve, starting at y=0
  const startPoint = new THREE.Vector3(0, 0, 0)
  const midPoint = new THREE.Vector3(
    Math.cos(angle) * frondLength * 0.7,
    -0.7 + Math.random() * 0.15,
    Math.sin(angle) * frondLength * 0.7
  )
  const endPoint = new THREE.Vector3(
    Math.cos(angle) * frondLength,
    -2.2 + Math.random() * 0.18,
    Math.sin(angle) * frondLength
  )
  const frondCurve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint)
  
  // Create dates along the frond
  const dates = []
  for (let i = 0; i < 24; i++) {
    const t = (i + 1) / 26 // Start slightly from base
    const position = frondCurve.getPoint(t)
    
    // Add clustering effect - dates grow in bunches
    const clusterOffset = Math.sin(t * Math.PI * 8) * 0.15
    position.x += Math.cos(angle + Math.PI/2) * clusterOffset
    position.z += Math.sin(angle + Math.PI/2) * clusterOffset
    position.y += Math.random() * 0.1 - 0.05
    
    dates.push(
      <DateFruit
        key={i}
        position={position}
        cityIndex={branchIndex}
        dateIndex={i}
        onClick={onClick}
      />
    )
  }

  useFrame((state) => {
    if (frondRef.current) {
      // Natural swaying motion
      const sway = Math.sin(state.clock.elapsedTime * 0.4 + branchIndex * 0.1) * 0.05
      frondRef.current.rotation.x = sway
      frondRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3 + branchIndex * 0.1) * 0.03
    }
  })

  // Create frond leaflets (the individual leaves along the frond)
  const leaflets = []
  for (let i = 0; i < 44; i++) {
    const t = i / 43;
    const pos = frondCurve.getPoint(t);
    const leafletSize = Math.sin(t * Math.PI) * (0.5 + Math.random() * 0.08) + 0.13;
    // Create leaflets on both sides of the frond
    const leafletAngle = angle + Math.PI/2 + (Math.random() - 0.5) * 0.04;
    const offsetDistance = 0.14 + Math.random() * 0.01;
    // Color gradient for fronds
    const green1 = '#2e7d32';
    const green2 = '#6fcf97';
    const grad = t < 0.5 ? green1 : green2;
    // Left side leaflet
    leaflets.push(
      <mesh 
        key={`left-${i}`}
        position={[
          pos.x + Math.cos(leafletAngle) * offsetDistance,
          pos.y,
          pos.z + Math.sin(leafletAngle) * offsetDistance
        ]}
        rotation={[0, leafletAngle, Math.PI/5 + (Math.random() - 0.5) * 0.1]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[leafletSize, 0.1 + Math.random() * 0.02]} />
        <meshLambertMaterial color={grad} side={THREE.DoubleSide} />
      </mesh>
    );
    // Right side leaflet
    leaflets.push(
      <mesh 
        key={`right-${i}`}
        position={[
          pos.x - Math.cos(leafletAngle) * offsetDistance,
          pos.y,
          pos.z - Math.sin(leafletAngle) * offsetDistance
        ]}
        rotation={[0, leafletAngle, -Math.PI/5 + (Math.random() - 0.5) * 0.1]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[leafletSize, 0.1 + Math.random() * 0.02]} />
        <meshLambertMaterial color={grad} side={THREE.DoubleSide} />
      </mesh>
    );
  }

  return (
    <group ref={frondRef}>
      {/* Main frond stem */}
      <mesh>
        <tubeGeometry args={[frondCurve, 50, 0.02, 8, false]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Leaflets */}
      {leaflets}
      
      {/* City label - visually appealing */}
      <Text
        position={[endPoint.x * 1, endPoint.y + 0.5, endPoint.z * 1]}
        fontSize={0.18}
        color="#333"
        anchorX="center"
        anchorY="middle"
        rotation={[ -Math.PI / 3, 0, 0 ]}
        font="https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyC0ISg.ttf"
        letterSpacing={0.02}
        maxWidth={2.2}
        textAlign="center"
        style={{ fontWeight: 700 }}
      >
        {city.name}
      </Text>
      
      {dates}
    </group>
  )
}

// Realistic Date Palm Tree Component
function DatePalmTree({ onClick }) {
  const treeRef = useRef()
  
  useFrame((state) => {
    if (treeRef.current) {
      // Very gentle rotation
      treeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  // Create realistic trunk with texture
  const trunkHeight = 20; // Reduced height
  const trunkSegments = [];
  for (let i = 0; i < trunkHeight; i++) {
    // Add a gentle curve to the trunk
    const curveAmount = 0.10 * Math.sin(i / trunkHeight * Math.PI * 1.2);
    const y = -2 + (i * 0.48);
    const x = curveAmount;
    const z = 0;
    const radius = 0.35 - (i * 0.011);
    const segmentHeight = 0.48;
    trunkSegments.push(
      <mesh
        key={i}
        position={[x, y, z]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius - 0.015, radius, segmentHeight, 18]} />
        <meshStandardMaterial color="#8B5C2A" roughness={0.7} metalness={0.1} />
      </mesh>
    );
    // Add trunk texture rings
    if (i > 0) {
      trunkSegments.push(
        <mesh 
          key={`ring-${i}`} 
          position={[x, y - segmentHeight/4, z]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[radius + 0.01, 0.025, 12, 24]} />
          <meshStandardMaterial color="#6B3F1D" roughness={0.5} metalness={0.2} />
        </mesh>
      );
    }
  }

  const fronds = []
  for (let i = 0; i < 24; i++) {
    fronds.push(
      <PalmFrond
        key={i}
        branchIndex={i}
        onClick={onClick}
      />
    )
  }

  // The top of the trunk is at y = -2 + (trunkHeight-1) * 0.48 + segmentHeight/2
  const topY = -2 + (trunkHeight - 1) * 0.48 + 0.24;
  return (
    <group ref={treeRef}>
      {/* Trunk segments */}
      {trunkSegments}
      {/* Crown/base where fronds emerge - move to top of trunk */}
      <mesh position={[0, topY, 0]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {/* Fronds - move to top of trunk */}
      <group position={[0, topY, 0]}>
        {fronds}
      </group>
    </group>
  )
}

// Enhanced Popup Modal Component
function CityPopup({ cityIndex, dateIndex, onClose }) {
  if (cityIndex === null) return null
  
  const city = cityData[cityIndex]
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{city.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Order Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
              <div 
                className="h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ 
                  width: `${city.purchased}%`,
                  backgroundColor: city.color,
                  minWidth: city.purchased > 20 ? 'auto' : '50px'
                }}
              >
                {city.purchased}%
              </div>
            </div>
            <p className="text-gray-600">{city.purchased}% of dates ordered from {city.name}</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">Date Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Date Number:</span>
                <p className="font-medium">#{dateIndex + 1}</p>
              </div>
              <div>
                <span className="text-gray-500">City:</span>
                <p className="font-medium">{city.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Branch:</span>
                <p className="font-medium">#{cityIndex + 1}</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium text-green-600">Available</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Professional Hero Component
export default function DatePalmHero() {
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateClick = (cityIndex, dateIndex) => {
    setSelectedCity(cityIndex)
    setSelectedDate(dateIndex)
  }

  const handleClosePopup = () => {
    setSelectedCity(null)
    setSelectedDate(null)
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white font-serif">
      {/* Hero Content - Left side */}
      <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-start z-10 pl-16">
        <div className="text-left max-w-lg px-0">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Premium
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Dates
            </span>
          </h1>
          <p className="text-xl mb-8 text-gray-700 font-light leading-relaxed">
            Discover the finest dates from across the nation
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Click on any date to explore premium quality from different cities. 
            Each branch represents a unique regional variety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 transition-all transform hover:scale-105 shadow-lg rounded-none">
              Explore Varieties
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 transition-all hover:bg-gray-50 rounded-none">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas - Right side, tree positioned to touch bottom and much larger */}
      <div className="absolute left-1/2 top-1/2 w-full h-[100vh] z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <Canvas 
          camera={{ position: [5, 18, 0.5], fov: 50 }}
          style={{ 
            background: 'transparent', 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%' 
          }}
          shadows="soft"
          gl={{ antialias: true }}
        >
          {/* Base ambient light for general illumination */}
          <ambientLight intensity={0.4} />
          
          {/* Main sunlight - casting shadows */}
          <directionalLight 
            position={[10, 30, 5]} 
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.001}
          />
          
          {/* Secondary rim light for depth */}
          <directionalLight 
            position={[-5, 15, -10]} 
            intensity={0.8}
            color="#FDB813"
          />
          
          {/* Warm ground reflection */}
          <hemisphereLight 
            groundColor="#e2c290" 
            color="#b3e6ff" 
            intensity={0.6} 
          />

          {/* Ground plane to receive shadows */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -5, 0]} 
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial transparent opacity={0.4} />
          </mesh>

          {/* Palm tree, bottom right, not overlapping text */}
          <group position={[0, -5, 0]} scale={[0.9, 0.9, 0.9]}>
            <DatePalmTree onClick={handleDateClick} />
          </group>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            minDistance={8}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
          />
        </Canvas>
      </div>
      {/* Right-side card for cities and country info */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 w-72 bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-2 text-gray-800 tracking-wide uppercase">Tunisia, North Africa</h3>
        <div className="text-gray-700 text-sm font-medium mb-2">24 Cities</div>
        <ul className="text-gray-600 text-sm space-y-1 max-h-72 overflow-y-auto pr-2">
          {cityData.map(city => (
            <li key={city.name} className="truncate">{city.name}</li>
          ))}
        </ul>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-5"></div>
      
      <CityPopup 
        cityIndex={selectedCity} 
        dateIndex={selectedDate} 
        onClose={handleClosePopup} 
      />
    </div>
  )
}