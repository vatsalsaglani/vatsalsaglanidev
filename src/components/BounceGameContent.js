"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

const BounceGameContent = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Game state refs (to avoid issues with closures in event listeners)
  const ballRef = useRef({
    x: 50,
    y: 50,
    radius: 10,
    dx: 4,
    dy: -4,
    jumping: false,
  });
  
  const playerRef = useRef({
    x: 50,
    y: 450,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    jumping: false,
    grounded: false,
  });
  
  const keysRef = useRef({
    right: false,
    left: false,
    up: false,
  });
  
  const gameStateRef = useRef({
    score,
    lives,
    gameOver,
    level,
    paused,
    platforms: [],
    spikes: [],
    coins: [],
    gameStarted: false,
    animationFrameId: null,
  });
  
  // Update refs when state changes
  useEffect(() => {
    gameStateRef.current.score = score;
    gameStateRef.current.lives = lives;
    gameStateRef.current.gameOver = gameOver;
    gameStateRef.current.level = level;
    gameStateRef.current.paused = paused;
    gameStateRef.current.gameStarted = gameStarted;
  }, [score, lives, gameOver, level, paused, gameStarted]);
  
  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Adjust player position based on new canvas size
      playerRef.current.y = canvas.height - 50;
    };
    
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    // Generate initial level
    generateLevel();
    
    // Keyboard event listeners
    const handleKeyDown = (e) => {
      if (gameStateRef.current.gameOver) return;
      
      if (e.key === "ArrowRight" || e.key === "d") {
        keysRef.current.right = true;
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        keysRef.current.left = true;
      }
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && playerRef.current.grounded) {
        keysRef.current.up = true;
        playerRef.current.jumping = true;
        playerRef.current.grounded = false;
        playerRef.current.dy = -12;
      }
      if (e.key === "p") {
        setPaused(!paused);
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === "ArrowRight" || e.key === "d") {
        keysRef.current.right = false;
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
        keysRef.current.up = false;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    // Touch controls for mobile
    const handleTouchStart = (e) => {
      if (gameStateRef.current.gameOver) return;
      
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      if (x < canvas.width / 3) {
        keysRef.current.left = true;
      } else if (x > (canvas.width / 3) * 2) {
        keysRef.current.right = true;
      } else {
        if (playerRef.current.grounded) {
          keysRef.current.up = true;
          playerRef.current.jumping = true;
          playerRef.current.grounded = false;
          playerRef.current.dy = -12;
        }
      }
    };
    
    const handleTouchEnd = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.up = false;
    };
    
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    
    // Start the game automatically
    startGame();
    
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      
      // Cancel animation frame
      if (gameStateRef.current.animationFrameId) {
        cancelAnimationFrame(gameStateRef.current.animationFrameId);
      }
    };
  }, []);
  
  // Generate level with platforms, spikes, and coins
  const generateLevel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const platforms = [];
    const spikes = [];
    const coins = [];
    
    // Ground platform
    platforms.push({
      x: 0,
      y: canvas.height - 20,
      width: canvas.width,
      height: 20,
    });
    
    // Random platforms
    const numPlatforms = 5 + gameStateRef.current.level * 2;
    for (let i = 0; i < numPlatforms; i++) {
      const width = Math.random() * 100 + 50;
      const x = Math.random() * (canvas.width - width);
      const y = Math.random() * (canvas.height - 150) + 50;
      
      platforms.push({
        x,
        y,
        width,
        height: 15,
      });
      
      // Add coins on some platforms
      if (Math.random() > 0.5) {
        coins.push({
          x: x + width / 2,
          y: y - 20,
          radius: 8,
          collected: false,
        });
      }
      
      // Add spikes on some platforms
      if (Math.random() > 0.7 && i > 0) {
        spikes.push({
          x: x + width / 4,
          y: y - 10,
          width: width / 2,
          height: 10,
        });
      }
    }
    
    // Reset player position
    playerRef.current.x = 50;
    playerRef.current.y = canvas.height - 50;
    playerRef.current.dx = 0;
    playerRef.current.dy = 0;
    playerRef.current.jumping = false;
    playerRef.current.grounded = false;
    
    gameStateRef.current.platforms = platforms;
    gameStateRef.current.spikes = spikes;
    gameStateRef.current.coins = coins;
  };
  
  // Start game loop
  const startGame = () => {
    if (gameStateRef.current.gameStarted) return;
    
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setPaused(false);
    
    generateLevel();
    gameLoop();
    
    // Set gameStarted in ref
    gameStateRef.current.gameStarted = true;
  };
  
  // Game loop
  const gameLoop = () => {
    if (gameStateRef.current.gameOver) return;
    
    if (!gameStateRef.current.paused) {
      update();
    }
    
    render();
    gameStateRef.current.animationFrameId = requestAnimationFrame(gameLoop);
  };
  
  // Update game state
  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const player = playerRef.current;
    const keys = keysRef.current;
    
    // Player movement
    if (keys.right) {
      player.dx = 5;
    } else if (keys.left) {
      player.dx = -5;
    } else {
      player.dx = 0;
    }
    
    // Apply gravity
    player.dy += 0.8;
    
    // Update player position
    player.x += player.dx;
    player.y += player.dy;
    
    // Keep player within canvas bounds
    if (player.x < 0) {
      player.x = 0;
    } else if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
    }
    
    // Check if player fell off the bottom
    if (player.y > canvas.height) {
      loseLife();
      return;
    }
    
    // Collision detection with platforms
    player.grounded = false;
    for (const platform of gameStateRef.current.platforms) {
      const direction = collisionCheck(player, platform);
      
      if (direction === "bottom" && player.dy >= 0) {
        player.grounded = true;
        player.jumping = false;
        player.dy = 0;
        player.y = platform.y - player.height;
      } else if (direction === "top" && player.dy < 0) {
        player.dy = 0;
        player.y = platform.y + platform.height;
      } else if (direction === "left" && player.dx < 0) {
        player.dx = 0;
        player.x = platform.x + platform.width;
      } else if (direction === "right" && player.dx > 0) {
        player.dx = 0;
        player.x = platform.x - player.width;
      }
    }
    
    // Collision detection with spikes
    for (const spike of gameStateRef.current.spikes) {
      if (collisionCheck(player, spike)) {
        loseLife();
        return;
      }
    }
    
    // Collision detection with coins
    for (const coin of gameStateRef.current.coins) {
      if (!coin.collected && circleRectCollision(coin, player)) {
        coin.collected = true;
        setScore(prevScore => prevScore + 10);
      }
    }
    
    // Check if all coins are collected
    const allCoinsCollected = gameStateRef.current.coins.every(coin => coin.collected);
    if (allCoinsCollected && gameStateRef.current.coins.length > 0) {
      setLevel(prevLevel => prevLevel + 1);
      setScore(prevScore => prevScore + 50);
      generateLevel();
    }
  };
  
  // Render game
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background - using your tailwind colors
    ctx.fillStyle = isDark ? "#141B1F" : "#F1F5F7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms - using your tailwind colors
    ctx.fillStyle = isDark ? "#1F292E" : "#E5E7EB";
    for (const platform of gameStateRef.current.platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw spikes - using your accent color
    ctx.fillStyle = "#FF4B1F"; // Your accent color
    for (const spike of gameStateRef.current.spikes) {
      ctx.beginPath();
      ctx.moveTo(spike.x, spike.y + spike.height);
      ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
      ctx.lineTo(spike.x + spike.width / 2, spike.y);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw coins
    ctx.fillStyle = "#FFD700"; // Gold color for coins
    for (const coin of gameStateRef.current.coins) {
      if (!coin.collected) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#B8860B";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    
    // Draw player (ball) - using your secondary color
    ctx.fillStyle = "#1FDDFF"; // Your secondary color
    ctx.beginPath();
    ctx.arc(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y + playerRef.current.height / 2,
      playerRef.current.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw face on the ball
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(
      playerRef.current.x + playerRef.current.width / 2 - 5,
      playerRef.current.y + playerRef.current.height / 2 - 5,
      3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
      playerRef.current.x + playerRef.current.width / 2 + 5,
      playerRef.current.y + playerRef.current.height / 2 - 5,
      3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
      playerRef.current.x + playerRef.current.width / 2,
      playerRef.current.y + playerRef.current.height / 2 + 5,
      5,
      0,
      Math.PI,
      false
    );
    ctx.stroke();
    
    // Draw UI - using your text colors
    ctx.fillStyle = isDark ? "#F1F5F7" : "#141B1F"; // Your text colors
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${gameStateRef.current.score}`, 10, 20);
    ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 10, 40);
    ctx.fillText(`Level: ${gameStateRef.current.level}`, 10, 60);
    
    // Draw pause indicator
    if (gameStateRef.current.paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
      ctx.font = "16px Arial";
      ctx.fillText("Press 'P' to continue", canvas.width / 2, canvas.height / 2 + 30);
      ctx.textAlign = "left";
    }
    
    // Draw game over screen
    if (gameStateRef.current.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = "20px Arial";
      ctx.fillText(`Final Score: ${gameStateRef.current.score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.font = "16px Arial";
      ctx.fillText("Click or tap to play again", canvas.width / 2, canvas.height / 2 + 50);
      ctx.textAlign = "left";
    }
    
    // Draw start screen
    if (!gameStateRef.current.gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("BOUNCE", canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = "16px Arial";
      ctx.fillText("Collect all coins to advance to the next level", canvas.width / 2, canvas.height / 2);
      ctx.fillText("Use arrow keys or WASD to move", canvas.width / 2, canvas.height / 2 + 30);
      ctx.fillText("Press Space or Up to jump", canvas.width / 2, canvas.height / 2 + 60);
      ctx.fillText("Click or tap to start", canvas.width / 2, canvas.height / 2 + 100);
      ctx.textAlign = "left";
    }
  };
  
  // Lose a life
  const loseLife = () => {
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setGameOver(true);
        gameStateRef.current.gameStarted = false;
      } else {
        // Reset player position
        playerRef.current.x = 50;
        playerRef.current.y = canvasRef.current.height - 50;
        playerRef.current.dx = 0;
        playerRef.current.dy = 0;
      }
      return newLives;
    });
  };
  
  // Collision detection helpers
  const collisionCheck = (rect1, rect2) => {
    // Calculate the sides of rect1
    const left1 = rect1.x;
    const right1 = rect1.x + rect1.width;
    const top1 = rect1.y;
    const bottom1 = rect1.y + rect1.height;
    
    // Calculate the sides of rect2
    const left2 = rect2.x;
    const right2 = rect2.x + rect2.width;
    const top2 = rect2.y;
    const bottom2 = rect2.y + rect2.height;
    
    // Check if the rectangles are not colliding
    if (right1 <= left2 || left1 >= right2 || bottom1 <= top2 || top1 >= bottom2) {
      return null;
    }
    
    // Calculate the overlap on each axis
    const overlapX1 = right1 - left2;
    const overlapX2 = right2 - left1;
    const overlapY1 = bottom1 - top2;
    const overlapY2 = bottom2 - top1;
    
    // Find the minimum overlap
    const minOverlapX = Math.min(overlapX1, overlapX2);
    const minOverlapY = Math.min(overlapY1, overlapY2);
    
    // Determine the collision direction
    if (minOverlapX < minOverlapY) {
      return overlapX1 < overlapX2 ? "right" : "left";
    } else {
      return overlapY1 < overlapY2 ? "bottom" : "top";
    }
  };
  
  const circleRectCollision = (circle, rect) => {
    // Find the closest point on the rectangle to the circle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Calculate the distance between the circle's center and the closest point
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    
    // Check if the distance is less than the circle's radius
    return distanceSquared < circle.radius * circle.radius;
  };
  
  // Handle canvas click to start game
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      startGame();
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-light-background dark:bg-dark-background">
      <div className="p-4 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-light-accent/10 dark:border-dark-accent/10">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Bounce</h2>
        <p className="text-sm text-light-text/70 dark:text-dark-text/70">
          Classic Nokia-style ball game. Collect coins and avoid spikes!
        </p>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Mobile controls overlay */}
        {gameStarted && !gameOver && !paused && (
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            <div className="w-1/3 h-full touch-manipulation pointer-events-auto opacity-0" />
            <div className="w-1/3 h-full touch-manipulation pointer-events-auto opacity-0" />
            <div className="w-1/3 h-full touch-manipulation pointer-events-auto opacity-0" />
          </div>
        )}
      </div>
      
      <div className="p-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-t border-light-accent/10 dark:border-dark-accent/10 text-xs text-center text-light-text/70 dark:text-dark-text/70">
        Controls: Arrow keys/WASD to move, Space/Up to jump, P to pause
      </div>
    </div>
  );
};

export default BounceGameContent; 