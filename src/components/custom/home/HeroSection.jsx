"use client"

import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'

// Tunisia 24 cities data with sales stats
const tunisianCities = [
  { name: 'Tunis', sales: 1250, growth: 15.3, orders: 89, quality: 4.8 },
  { name: 'Sfax', sales: 980, growth: 12.7, orders: 67, quality: 4.6 },
  { name: 'Sousse', sales: 1100, growth: 18.2, orders: 73, quality: 4.7 },
  { name: 'Ettadhamen', sales: 750, growth: 9.8, orders: 45, quality: 4.5 },
  { name: 'Kairouan', sales: 890, growth: 14.1, orders: 58, quality: 4.9 },
  { name: 'Gabès', sales: 670, growth: 8.4, orders: 41, quality: 4.4 },
  { name: 'Bizerte', sales: 820, growth: 11.6, orders: 52, quality: 4.6 },
  { name: 'Ariana', sales: 720, growth: 13.2, orders: 47, quality: 4.5 },
  { name: 'Gafsa', sales: 560, growth: 7.9, orders: 35, quality: 4.3 },
  { name: 'Monastir', sales: 640, growth: 10.5, orders: 38, quality: 4.4 },
  { name: 'Médenine', sales: 590, growth: 9.1, orders: 33, quality: 4.2 },
  { name: 'Tataouine', sales: 480, growth: 6.8, orders: 28, quality: 4.1 },
  { name: 'La Marsa', sales: 710, growth: 12.3, orders: 44, quality: 4.7 },
  { name: 'El Kef', sales: 420, growth: 5.7, orders: 24, quality: 4.0 },
  { name: 'Mahdia', sales: 530, growth: 8.6, orders: 31, quality: 4.2 },
  { name: 'Zarzis', sales: 610, growth: 9.9, orders: 36, quality: 4.3 },
  { name: 'Kasserine', sales: 450, growth: 6.2, orders: 26, quality: 4.1 },
  { name: 'Ben Arous', sales: 680, growth: 11.1, orders: 42, quality: 4.5 },
  { name: 'Jendouba', sales: 380, growth: 4.8, orders: 22, quality: 3.9 },
  { name: 'Tozeur', sales: 510, growth: 7.5, orders: 29, quality: 4.2 },
  { name: 'Nabeul', sales: 770, growth: 13.8, orders: 49, quality: 4.6 },
  { name: 'Siliana', sales: 340, growth: 3.9, orders: 19, quality: 3.8 },
  { name: 'Beja', sales: 410, growth: 5.4, orders: 23, quality: 4.0 },
  { name: 'Manouba', sales: 580, growth: 8.9, orders: 34, quality: 4.3 }
]

// Sales Stats Popup Component
function SalesStatsPopup({ cityData, onClose }) {
  if (!cityData) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{cityData.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Sales Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-4 text-lg">Sales Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">${cityData.sales}</div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">+{cityData.growth}%</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-4 text-lg">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-semibold text-amber-600">{cityData.orders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quality Rating:</span>
                <div className="flex items-center">
                  <span className="font-semibold text-amber-600 mr-1">{cityData.quality}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(cityData.quality) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
              </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Share:</span>
                <span className="font-semibold text-amber-600">{((cityData.sales / 20000) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
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
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Date Fruit Component
function DateFruit({ position, cityColor }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <mesh
      position={position}
      scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
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
    >
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial 
        color="#8B4513"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

// City Label Component
function CityLabel({ position, cityData, index, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  // Generate color based on city index
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b',
    '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894', '#00cec9', '#fdcb6e',
    '#e17055', '#81ecec', '#ffeaa7', '#fab1a0', '#ff7675', '#74b9ff',
    '#00b894', '#fdcb6e', '#e84393', '#00cec9', '#6c5ce7', '#fd79a8'
  ]
  
  const cityColor = colors[index % colors.length]
  
  // Generate date positions around the city
  const datePositions = []
  const numDates = 3 + Math.floor(Math.random() * 4) // 3-6 dates per city
  
  for (let i = 0; i < numDates; i++) {
    const angle = (i / numDates) * Math.PI * 2
    const radius = 2 + Math.random() * 1.5
    const height = (Math.random() - 0.5) * 2
    
    datePositions.push([
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ])
  }
  
  return (
    <group position={position}>
      {/* Clickable background for city name */}
      <mesh 
        position={[0, 4, -0.2]} 
        rotation={[-Math.PI / 6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick(cityData)
        }}
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
      >
        <boxGeometry args={[cityData.name.length * 1.0 + 3, 3, 0.5]} />
        <meshBasicMaterial 
          color={hovered ? "#f0f0f0" : "white"} 
          transparent 
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Rounded corners for the background */}
      <mesh 
        position={[-cityData.name.length * 0.5 - 1.2, 4, -0.2]} 
        rotation={[-Math.PI / 6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick(cityData)
        }}
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
      >
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial 
          color={hovered ? "#f0f0f0" : "white"} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      <mesh 
        position={[cityData.name.length * 0.5 + 1.2, 4, -0.2]} 
        rotation={[-Math.PI / 6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick(cityData)
        }}
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
      >
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial 
          color={hovered ? "#f0f0f0" : "white"} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* City name text - clickable */}
      <Text
        position={[0, 4, 0.3]}
        fontSize={1.5}
        color={hovered ? "#333" : "black"}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 6, 0, 0]}
        font="https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyC0ISg.ttf"
        letterSpacing={0.02}
        maxWidth={15}
        textAlign="center"
        fontWeight="bold"
        outlineWidth={0.05}
        outlineColor="#000000"
        onClick={(e) => {
          e.stopPropagation()
          onClick(cityData)
        }}
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
      >
        {cityData.name}
      </Text>
      
      {/* City indicator sphere */}
      <mesh 
        position={[0, 1, 0]}
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
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial 
          color={cityColor}
          transparent 
          opacity={hovered ? 0.9 : 0.7}
          emissive={cityColor}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Date fruits around the city */}
      {datePositions.map((datePos, i) => (
        <DateFruit
          key={i}
          position={datePos}
          cityColor={cityColor}
        />
      ))}
    </group>
  )
}

// Complete Date Palm Tree 3D Model Component - including land and grass
function DatePalmTree3D({ onCityClick }) {
  const { scene, materials } = useGLTF('/3d/date-palm/scene.gltf')
  const treeRef = useRef()
  
  // Clone the scene to avoid modifying the original
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    
    // Ensure all materials are properly applied and visible
    cloned.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows for all mesh components
        child.castShadow = true
        child.receiveShadow = true
        
        // Ensure materials are properly set
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.side = THREE.DoubleSide // Make sure both sides are visible
            })
          } else {
            child.material.side = THREE.DoubleSide
          }
        }
      }
    })
    
    return cloned
  }, [scene])
  
  useFrame((state) => {
    if (treeRef.current) {
      // Fixed rotation only on X-axis - no position movement
      treeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
      // Keep position completely fixed
      treeRef.current.position.set(0, 0, 0)
    }
  })

  // Define positions for cities on the palm tree branches
  // Higher positions with some floating in air around the palm tree
  const branchPositions = [
    // // Top tier fronds (highest branches) - floating in air
    [25, 60, 15],   // Tunis - floating above main branch
    [-20, 62, 18],  // Sfax - floating high
    [30, 60, -10],  // Sousse - very high
    [-25, 60, -12], // Ettadhamen - floating
    [18, 60, 22],   // Kairouan - highest point
    [-30, 60, 8],   // Gabès - floating
    
    // High mid-upper tier - some on branches, some floating
    [35, 56, 5],    // Bizerte - floating
    [-15, 58, -20], // Ariana - floating
    [22, 58, -18],  // Gafsa - on high branch
    [-28, 60, 15],  // Monastir - floating
    [32, 59, -5],   // Médenine - on branch
    [-22, 55, -15], // Tataouine - floating
    
    // Mid tier - mixed positions
    [28, 55, 20],   // La Marsa - on branch
    [-18, 57, 12],  // El Kef - floating
    [15, 54, -22],  // Mahdia - on branch
    [-32, 56, -8],  // Zarzis - floating
    [26, 53, 8],    // Kasserine - on branch
    [-12, 58, -25], // Ben Arous - floating
    
    // Lower-mid tier - still elevated
    [20, 50, 18],   // Jendouba - on branch
    [-25, 52, 20],  // Tozeur - floating
    [30, 51, -15],  // Nabeul - on branch
    [-20, 49, -12], // Siliana - on branch
    [15, 53, 25],   // Beja - floating
    [-28, 48, 10]   // Manouba - on branch
  ]

  return (
    <group ref={treeRef}>
      {/* The complete 3D palm tree model with all components (tree, land, grass) */}
      <primitive 
        object={clonedScene} 
        scale={[20, 10, 20]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
      
      {/* City labels positioned on the branches */}
      {tunisianCities.map((cityData, index) => (
        <CityLabel
          key={cityData.name}
          position={branchPositions[index]}
          cityData={cityData}
          index={index}
          onClick={onCityClick}
        />
      ))}
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/3d/date-palm/scene.gltf')

// Main Professional Hero Component
export default function DatePalmHero() {
  const [selectedCity, setSelectedCity] = useState(null)

  const handleCityClick = (cityData) => {
    setSelectedCity(cityData)
  }

  const handleClosePopup = () => {
    setSelectedCity(null)
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white font-serif">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('/bgs/grass.jpg')` }}></div>
      {/* Hero Content - Left side */}
      <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-start z-10 pl-16">
        <div className="text-left max-w-lg px-0">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 shadow-lg tracking-wide">
            Premium
            <span className="block bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text shadow-lg">
              Dates
            </span>
          </h1>
          <p className="text-xl text-white font-light mt-10">
            Discover the finest dates from across the nation
          </p>
          <p className="text-lg text-white mb-8 leading-relaxed">
            Experience the authentic taste of premium quality dates 
            sourced from the finest date palms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 transition-all transform hover:scale-105 shadow-lg rounded-none">
              Explore Varieties
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-white hover:text-black font-semibold py-4 px-8 transition-all hover:bg-gray-50 rounded-none">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas - Right side with the GLTF palm tree */}
      <div className="absolute left-1/2 top-1/2 w-4/5 h-full z-20 flex items-center justify-center -translate-x-1/4 -translate-y-1/2">
        <Canvas 
          camera={{ position: [80, 50, 120], fov: 30 }}
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
          <ambientLight intensity={0.9} />
          
          {/* Main sunlight - casting shadows */}
          <directionalLight 
            position={[-40, 60, 30]} 
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={300}
            shadow-camera-left={-150}
            shadow-camera-right={150}
            shadow-camera-top={150}
            shadow-camera-bottom={-150}
            shadow-bias={-0.001}
          />
          
          {/* Secondary rim light for depth */}
          <directionalLight 
            position={[-30, 80, -60]} 
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
            position={[0, -40, 0]} 
            receiveShadow
          >
            <planeGeometry args={[600, 600]} />
            <shadowMaterial transparent opacity={0.4} />
          </mesh>

          {/* The 3D Palm tree model - much larger */}
          <group position={[0, -40, 0]}>
            <DatePalmTree3D onCityClick={handleCityClick} />
          </group>
          
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
          />
        </Canvas>
      </div>
      
      
      {/* Decorative elements */}
        {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-5"></div> */}
        
        {/* Sales Stats Popup */}
        <SalesStatsPopup 
          cityData={selectedCity} 
        onClose={handleClosePopup} 
      />
    </div>
  )
}