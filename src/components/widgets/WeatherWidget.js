"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setIsMounted(true);
    
    // Get user's location
    const getUserLocation = async () => {
      try {
        setLoading(true);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              try {
                // Fetch weather data using OpenWeatherMap API
                const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                
                const weatherResponse = await fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
                );

                if (!weatherResponse.ok) {
                  throw new Error("Failed to fetch weather data");
                }

                const weatherData = await weatherResponse.json();
                setWeather(weatherData);
                setLocation({
                  city: weatherData.name,
                  country: weatherData.sys.country,
                });

                // Generate AI insight based on weather
                generateAiInsight(weatherData);

                setLoading(false);
              } catch (error) {
                console.error("Error fetching weather:", error);
                // Fallback to mock data for demo purposes
                setMockWeatherData();
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Fallback to mock data
              setMockWeatherData();
            }
          );
        } else {
          // Geolocation not supported
          setMockWeatherData();
        }
      } catch (error) {
        console.error("Weather widget error:", error);
        setError("Failed to load weather data");
        setLoading(false);
      }
    };

    // Only run on client-side
    if (isMounted) {
      getUserLocation();
      
      // Refresh every 30 minutes
      const interval = setInterval(getUserLocation, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isMounted]);

  // Fallback to mock data for demo or when API is not available
  const setMockWeatherData = () => {
    const mockWeather = {
      main: {
        temp: 22,
        feels_like: 23,
        humidity: 65,
      },
      weather: [
        {
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      wind: {
        speed: 3.5,
      },
    };

    setWeather(mockWeather);
    setLocation({
      city: "San Francisco",
      country: "US",
    });

    generateAiInsight(mockWeather);
    setLoading(false);
  };

  // Generate AI insight based on weather conditions
  const generateAiInsight = (weatherData) => {
    const condition = weatherData.weather[0].main.toLowerCase();
    const temp = weatherData.main.temp;

    // Get current hour to determine time of day
    const currentHour = new Date().getHours();

    // Determine time of day
    let timeOfDay = "";
    let timeInsight = "";

    if (currentHour >= 5 && currentHour < 12) {
      timeOfDay = "morning";
      timeInsight = "Morning hours are ideal for analytical tasks. Your brain is most alert for complex problem-solving now.";
    } else if (currentHour >= 12 && currentHour < 17) {
      timeOfDay = "afternoon";
      timeInsight = "Afternoon is perfect for collaborative work. Your communication skills peak during these hours.";
    } else if (currentHour >= 17 && currentHour < 21) {
      timeOfDay = "evening";
      timeInsight = "Evening brings enhanced creativity. Great time for brainstorming or designing new features.";
    } else if (currentHour >= 21 || currentHour < 1) {
      timeOfDay = "night";
      timeInsight = "Night hours can offer distraction-free focus. Consider tackling tasks requiring deep concentration.";
    } else {
      timeOfDay = "midnight";
      timeInsight = "Late night coding can be productive, but remember to balance with adequate rest for optimal performance tomorrow.";
    }

    // Weather condition insights (existing code)
    let weatherInsight = "";

    if (condition.includes("clear") || condition.includes("sun")) {
      weatherInsight = "Perfect sunny day! Research shows natural light boosts productivity. Consider working near a window to maximize focus.";
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      weatherInsight = "Rainy days enhance creative thinking. Studies show ambient rain sounds can improve concentration by 30%.";
    } else if (condition.includes("cloud")) {
      weatherInsight = "Cloudy weather reduces screen glare, ideal for coding sessions. Take advantage with a longer focused work period.";
    } else if (condition.includes("snow")) {
      weatherInsight = "Snowy conditions create a natural sound dampening effect. Excellent for deep work requiring minimal distractions.";
    } else if (condition.includes("thunder") || condition.includes("storm")) {
      weatherInsight = "Stormy weather can increase alertness. Good time for brainstorming or tackling complex problems.";
    } else if (temp > 30) {
      weatherInsight = "High temperatures may reduce cognitive performance. Consider more breaks and stay hydrated while coding.";
    } else if (temp < 5) {
      weatherInsight = "Cold weather increases glucose consumption. Have a warm drink nearby to maintain optimal brain function during coding.";
    } else {
      weatherInsight = "Current conditions are balanced. A good time for both analytical and creative programming tasks.";
    }

    // Combine time and weather insights
    let insight = `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} + ${condition}: ${timeInsight} ${weatherInsight}`;

    // For special combinations, provide unique insights
    if (timeOfDay === "morning" && (condition.includes("clear") || condition.includes("sun"))) {
      insight = "Morning sunshine is optimal for productivity. Your circadian rhythm is perfectly aligned with natural light, making this an ideal time for your most important coding tasks.";
    } else if (timeOfDay === "evening" && (condition.includes("rain") || condition.includes("drizzle"))) {
      insight = "Evening rain creates a perfect coding atmosphere. The combination of natural white noise and your brain's evening creativity peak is excellent for solving complex problems.";
    } else if (timeOfDay === "night" && condition.includes("clear")) {
      insight = "Clear night skies can inspire big-picture thinking. Consider stepping outside briefly to reset your mental state before diving into architectural decisions.";
    } else if (timeOfDay === "midnight" && (condition.includes("thunder") || condition.includes("storm"))) {
      insight = "Midnight storms create a dramatic backdrop for coding breakthroughs. The heightened alertness from both the late hour and weather conditions can lead to unexpected solutions.";
    }

    setAiInsight(insight);
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Show a simple loading state during SSR
  if (!isMounted) {
    return (
      <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c-5.33 4-8 8.27-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-3.73-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1.77.78-3.94 2.65-6.27C9.97 5.96 11.28 4.43 12 3.25c.72 1.18 2.03 2.71 3.35 4.48C17.22 10.06 18 12.23 18 14c0 3.31-2.69 6-6 6zm-2.5-4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
            </svg>
            <h3 className="font-medium">Weather AI</h3>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2c-5.33 4-8 8.27-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-3.73-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1.77.78-3.94 2.65-6.27C9.97 5.96 11.28 4.43 12 3.25c.72 1.18 2.03 2.71 3.35 4.48C17.22 10.06 18 12.23 18 14c0 3.31-2.69 6-6 6zm-2.5-4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
          </svg>
          <h3 className="font-medium">Weather AI</h3>
        </div>
        {location && (
          <div className="text-xs text-blue-400 font-medium">
            {location.city}, {location.country}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-xs p-4 text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      ) : weather ? (
        <div>
          {/* Current Weather */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={getWeatherIconUrl(weather.weather[0].icon)}
                alt={weather.weather[0].description}
                className="w-16 h-16 mr-2"
              />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="text-sm capitalize">
                  {weather.weather[0].description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                Feels like: {Math.round(weather.main.feels_like)}°C
              </div>
              <div className="text-sm">Humidity: {weather.main.humidity}%</div>
              <div className="text-sm">
                Wind: {Math.round(weather.wind.speed)} m/s
              </div>
            </div>
          </div>

          {/* AI Productivity Insight */}
          <div className="bg-white/10 p-3 rounded-lg mb-3">
            <div className="flex items-center mb-2">
              <svg
                className="w-4 h-4 mr-2 text-purple-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <div className="text-xs font-semibold text-purple-300">
                AI PRODUCTIVITY INSIGHT
              </div>
            </div>
            <p className="text-sm text-white/90">{aiInsight}</p>
          </div>

          {/* Forecast Teaser */}
          <div className="text-center text-xs text-white/70 mt-2">
            Updated{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ) : (
        <div className="text-center p-4 text-white/70 text-sm">
          No weather data available
        </div>
      )}
    </div>
  );
}
