"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

const DinoGameContent = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jumping, setJumping] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Game objects
  const playerRef = useRef({
    x: 50,
    y: 0,
    width: 30,
    height: 30,
    jumpHeight: 100,
    jumpSpeed: 10,
    currentJumpSpeed: 0,
    onGround: true
  });

  const obstaclesRef = useRef([]);
  const groundYRef = useRef(0);
  const gameSpeedRef = useRef(5);
  const frameCountRef = useRef(0);
  const animationRef = useRef(null);

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
      
      // Set ground position to 80% of canvas height
      groundYRef.current = canvas.height * 0.8;
      playerRef.current.y = groundYRef.current - playerRef.current.height;
    };
    
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    // Event listeners for jump
    const handleKeyDown = (e) => {
      if ((e.code === "Space" || e.code === "ArrowUp" || e.key === " " || e.key === "w") && 
          playerRef.current.onGround && gameStarted && !gameOver) {
        jump();
      }
      
      // Start game with any key
      if (!gameStarted || gameOver) {
        startGame();
      }
    };
    
    // Handle click/tap
    const handleClick = () => {
      if (playerRef.current.onGround && gameStarted && !gameOver) {
        jump();
      }
      
      // Start game with click/tap
      if (!gameStarted || gameOver) {
        startGame();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleClick);
    
    // Draw initial frame
    drawGame();
    
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleClick);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update game state based on theme changes
  useEffect(() => {
    drawGame();
  }, [theme]);

  // Start game
  const startGame = () => {
    if (gameStarted && !gameOver) return;
    
    // Reset game state
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    obstaclesRef.current = [];
    gameSpeedRef.current = 5;
    frameCountRef.current = 0;
    playerRef.current.onGround = true;
    playerRef.current.y = groundYRef.current - playerRef.current.height;
    
    // Start game loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    gameLoop();
  };

  // Game loop
  const gameLoop = () => {
    updateGame();
    drawGame();
    
    if (!gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Update game state
  const updateGame = () => {
    frameCountRef.current++;
    
    // Increase score
    if (frameCountRef.current % 5 === 0) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Increase game speed gradually
    if (frameCountRef.current % 1000 === 0) {
      gameSpeedRef.current += 0.5;
    }
    
    // Handle jumping
    if (!playerRef.current.onGround) {
      playerRef.current.y += playerRef.current.currentJumpSpeed;
      playerRef.current.currentJumpSpeed += 0.7; // Gravity
      
      // Check if landed
      if (playerRef.current.y >= groundYRef.current - playerRef.current.height) {
        playerRef.current.y = groundYRef.current - playerRef.current.height;
        playerRef.current.onGround = true;
        setJumping(false);
      }
    }
    
    // Generate obstacles
    if (frameCountRef.current % 100 === 0 || 
        (obstaclesRef.current.length === 0 && frameCountRef.current > 50)) {
      const canvas = canvasRef.current;
      
      // Add variation to obstacle height (cactus-like)
      const height = Math.random() * 30 + 20;
      
      obstaclesRef.current.push({
        x: canvas.width,
        y: groundYRef.current - height,
        width: 20,
        height: height
      });
    }
    
    // Move obstacles
    obstaclesRef.current.forEach(obstacle => {
      obstacle.x -= gameSpeedRef.current;
    });
    
    // Remove obstacles that are off-screen
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => obstacle.x + obstacle.width > 0);
    
    // Check for collisions
    const player = playerRef.current;
    
    for (const obstacle of obstaclesRef.current) {
      if (player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        // Collision detected
        setGameOver(true);
        
        // Update high score
        if (score > highScore) {
          setHighScore(score);
        }
        
        break;
      }
    }
  };

  // Draw game elements
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = isDark ? "#141B1F" : "#F1F5F7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = isDark ? "#1F292E" : "#E5E7EB";
    ctx.fillRect(0, groundYRef.current, canvas.width, 2);
    
    // Draw obstacles
    ctx.fillStyle = "#FF4B1F"; // Your accent color
    obstaclesRef.current.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw player (using your secondary color)
    ctx.fillStyle = "#1FDDFF"; // Your secondary color
    ctx.fillRect(playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
    
    // Add simple face to player (dino/character)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(playerRef.current.x + playerRef.current.width - 10, playerRef.current.y + 8, 5, 5); // Eye
    ctx.fillRect(playerRef.current.x + playerRef.current.width - 15, playerRef.current.y + 20, 10, 3); // Mouth
    
    // Draw score
    ctx.fillStyle = isDark ? "#F1F5F7" : "#141B1F"; // Your text colors
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 20, 30);
    
    if (highScore > 0) {
      ctx.fillText(`High Score: ${highScore}`, 20, 50);
    }
    
    // Draw game over or start screen
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.font = "18px monospace";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText("Press any key or tap to restart", canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.textAlign = "left";
    } else if (!gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "30px monospace";
      ctx.textAlign = "center";
      ctx.fillText("DINO RUNNER", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.font = "18px monospace";
      ctx.fillText("Press any key or tap to start", canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText("Press Space/Up to jump", canvas.width / 2, canvas.height / 2 + 40);
      
      ctx.textAlign = "left";
    }
  };

  // Jump function
  const jump = () => {
    if (playerRef.current.onGround) {
      playerRef.current.onGround = false;
      playerRef.current.currentJumpSpeed = -playerRef.current.jumpSpeed;
      setJumping(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-light-background dark:bg-dark-background">
      <div className="p-4 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-light-accent/10 dark:border-dark-accent/10">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Dino Runner</h2>
        <p className="text-sm text-light-text/70 dark:text-dark-text/70">
          Jump over obstacles and survive as long as possible!
        </p>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
      
      <div className="p-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-t border-light-accent/10 dark:border-dark-accent/10 text-xs text-center text-light-text/70 dark:text-dark-text/70">
        Controls: Space/Up/Click to jump
      </div>
    </div>
  );
};

export default DinoGameContent; 