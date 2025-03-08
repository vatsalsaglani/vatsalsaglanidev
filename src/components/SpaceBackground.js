"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    
    // Renderer setup with explicit dimensions
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false // Change to false for solid background
    });
    
    // Get the exact dimensions of the container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Set renderer size with exact dimensions
    renderer.setSize(width, height);
    renderer.setClearColor(0x141B1F, 1); // Dark background color from theme
    containerRef.current.appendChild(renderer.domElement);
    
    // Force the canvas to fill the container
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    
    // Handle resize with more aggressive approach
    const handleResize = () => {
      if (!containerRef.current) return;
      
      // Get the exact dimensions again
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update camera and renderer with exact dimensions
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false); // false to avoid setting canvas style
      
      // Force a render after resize
      renderer.render(scene, camera);
    };
    
    // Create a ResizeObserver with immediate callback
    const resizeObserver = new ResizeObserver((entries) => {
      // Use setTimeout to ensure the DOM has fully updated
      setTimeout(handleResize, 0);
    });
    
    // Observe the container element
    resizeObserver.observe(containerRef.current);
    
    // Also listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Create stars
    const createStars = () => {
      // Create star particles
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xF1F5F7, // Using text color from theme
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });
      
      // Create star positions
      const starsCount = 2500; // Increased star count
      const starsPositions = new Float32Array(starsCount * 3);
      const starsSizes = new Float32Array(starsCount);
      
      for (let i = 0; i < starsCount; i++) {
        const i3 = i * 3;
        // Distribute stars in a sphere
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starsPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Vary star sizes
        starsSizes[i] = Math.random() * 0.5 + 0.1;
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
      starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Create nebula with accent color
    const createNebula = () => {
      const nebulaGeometry = new THREE.BufferGeometry();
      const nebulaMaterial = new THREE.PointsMaterial({
        color: 0xFF4B1F, // Accent color from theme
        size: 0.2,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      });
      
      const nebulaCount = 1000;
      const nebulaPositions = new Float32Array(nebulaCount * 3);
      const nebulaSizes = new Float32Array(nebulaCount);
      
      for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        // Create a cloud-like formation
        const radius = 15 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        nebulaPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        nebulaPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        nebulaPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Vary nebula particle sizes
        nebulaSizes[i] = Math.random() * 1.5 + 0.5;
      }
      
      nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
      nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
      
      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
      scene.add(nebula);
      
      return nebula;
    };
    
    // Create secondary nebula with secondary color
    const createSecondaryNebula = () => {
      const nebulaGeometry = new THREE.BufferGeometry();
      const nebulaMaterial = new THREE.PointsMaterial({
        color: 0x1FDDFF, // Secondary color from theme
        size: 0.2,
        transparent: true,
        opacity: 0.2,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      });
      
      const nebulaCount = 800;
      const nebulaPositions = new Float32Array(nebulaCount * 3);
      const nebulaSizes = new Float32Array(nebulaCount);
      
      for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        // Create a different cloud-like formation
        const radius = 25 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        nebulaPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        nebulaPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        nebulaPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Vary nebula particle sizes
        nebulaSizes[i] = Math.random() * 1.2 + 0.3;
      }
      
      nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
      nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
      
      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
      scene.add(nebula);
      
      return nebula;
    };
    
    // Create distant galaxies
    const createGalaxies = () => {
      const galaxiesGroup = new THREE.Group();
      
      // Create a few distant galaxies with theme colors
      const galaxyColors = [0x1FDDFF, 0xFF4B1F, 0xF1F5F7];
      
      for (let g = 0; g < 3; g++) {
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyMaterial = new THREE.PointsMaterial({
          color: galaxyColors[g],
          size: 0.15,
          transparent: true,
          opacity: 0.2,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        });
        
        const galaxyCount = 500;
        const galaxyPositions = new Float32Array(galaxyCount * 3);
        
        // Position the galaxy
        const galaxyDistance = 80 + Math.random() * 40;
        const galaxyTheta = Math.random() * Math.PI * 2;
        const galaxyPhi = Math.acos(2 * Math.random() - 1);
        
        const galaxyX = galaxyDistance * Math.sin(galaxyPhi) * Math.cos(galaxyTheta);
        const galaxyY = galaxyDistance * Math.sin(galaxyPhi) * Math.sin(galaxyTheta);
        const galaxyZ = galaxyDistance * Math.cos(galaxyPhi);
        
        // Create galaxy particles in a disc shape
        for (let i = 0; i < galaxyCount; i++) {
          const i3 = i * 3;
          const radius = Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          
          galaxyPositions[i3] = galaxyX + radius * Math.cos(theta);
          galaxyPositions[i3 + 1] = galaxyY + radius * Math.sin(theta) * 0.3; // Flatten the disc
          galaxyPositions[i3 + 2] = galaxyZ + (Math.random() - 0.5) * 2; // Add some thickness
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
        
        const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        galaxiesGroup.add(galaxy);
      }
      
      scene.add(galaxiesGroup);
      return galaxiesGroup;
    };
    
    // Create celestial objects
    const stars = createStars();
    const nebula = createNebula();
    const secondaryNebula = createSecondaryNebula();
    const galaxies = createGalaxies();
    
    // Animation with forced render on each frame
    let frame = 0;
    const animate = () => {
      frame += 0.001;
      
      // Rotate stars slowly
      stars.rotation.y = frame * 0.05;
      stars.rotation.x = frame * 0.025;
      
      // Rotate nebula
      nebula.rotation.y = frame * 0.1;
      nebula.rotation.z = frame * 0.05;
      
      // Rotate secondary nebula in opposite direction
      secondaryNebula.rotation.y = -frame * 0.07;
      secondaryNebula.rotation.z = -frame * 0.03;
      
      // Pulse nebula size
      const pulseScale = 1 + Math.sin(frame * 2) * 0.05;
      nebula.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Pulse secondary nebula with offset
      const secondaryPulseScale = 1 + Math.sin(frame * 2 + Math.PI) * 0.05;
      secondaryNebula.scale.set(secondaryPulseScale, secondaryPulseScale, secondaryPulseScale);
      
      // Rotate galaxies
      galaxies.rotation.y = frame * 0.03;
      galaxies.rotation.x = frame * 0.01;
      
      // Render scene
      renderer.render(scene, camera);
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Force an initial render
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      stars.geometry.dispose();
      stars.material.dispose();
      nebula.geometry.dispose();
      nebula.material.dispose();
      secondaryNebula.geometry.dispose();
      secondaryNebula.material.dispose();
      
      galaxies.children.forEach(galaxy => {
        galaxy.geometry.dispose();
        galaxy.material.dispose();
      });
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0"
      style={{ 
        zIndex: 0,
        pointerEvents: 'none', // Allow clicking through to content
        backgroundColor: '#141B1F', // Always dark background
        overflow: 'hidden', // Prevent any overflow issues
        opacity: '0.7', // Slightly reduced opacity to be less dominant
      }}
    />
  );
};

export default SpaceBackground; 