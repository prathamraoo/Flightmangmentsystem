import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  FlightTakeoff,
  LocationOn,
  Map,
  List,
  TrendingUp,
} from "@mui/icons-material";

// Indian cities coordinates (approximate for visualization)
const statePaths = [
  { id: 'JK', name: 'Jammu & Kashmir', d: 'M210,10 L230,5 L250,5 L270,10 L280,30 L260,50 L240,70 L210,60 L200,40 Z' },
  { id: 'HP', name: 'Himachal Pradesh', d: 'M240,70 L260,50 L280,60 L290,80 L280,100 L250,110 L230,90 Z' },
  { id: 'UK', name: 'Uttarakhand', d: 'M250,110 L280,100 L300,110 L310,130 L290,150 L260,140 Z' },
  { id: 'PB', name: 'Punjab', d: 'M200,75 L230,90 L220,120 L190,110 L180,90 Z' },
  { id: 'HR', name: 'Haryana', d: 'M220,120 L240,140 L230,165 L210,160 L200,130 Z' },
  { id: 'RJ', name: 'Rajasthan', d: 'M180,110 L210,160 L200,220 L150,250 L100,220 L110,150 Z' },
  { id: 'UP', name: 'Uttar Pradesh', d: 'M240,140 L290,150 L340,180 L350,220 L300,250 L250,230 L230,165 Z' },
  { id: 'GJ', name: 'Gujarat', d: 'M100,220 L150,250 L140,300 L80,310 L60,280 L70,230 Z' },
  { id: 'MP', name: 'Madhya Pradesh', d: 'M150,250 L250,230 L300,250 L320,300 L280,350 L200,340 L160,300 Z' },
  { id: 'MH', name: 'Maharashtra', d: 'M140,300 L200,340 L280,350 L270,410 L180,430 L120,410 L110,350 Z' },
  { id: 'KA', name: 'Karnataka', d: 'M150,430 L210,450 L240,500 L210,540 L180,520 L160,480 Z' },
  { id: 'AP', name: 'Andhra Pradesh', d: 'M210,450 L270,410 L320,450 L310,520 L280,540 L240,500 Z' },
  { id: 'TN', name: 'Tamil Nadu', d: 'M210,540 L280,540 L270,580 L230,590 L210,570 Z' },
  { id: 'KL', name: 'Kerala', d: 'M180,520 L210,540 L210,570 L190,580 L170,550 Z' },
  { id: 'OR', name: 'Odisha', d: 'M320,350 L380,380 L390,430 L350,470 L320,450 L300,410 Z' },
  { id: 'CH', name: 'Chhattisgarh', d: 'M280,350 L320,350 L310,450 L270,410 Z' },
  { id: 'TS', name: 'Telangana', d: 'M240,380 L290,380 L300,430 L250,440 Z' },
  { id: 'BI', name: 'Bihar', d: 'M350,220 L400,230 L410,270 L360,270 Z' },
  { id: 'JH', name: 'Jharkhand', d: 'M360,270 L410,270 L400,310 L340,310 Z' },
  { id: 'WB', name: 'West Bengal', d: 'M410,270 L440,280 L430,350 L400,350 L410,310 Z' },
  { id: 'NE', name: 'North East', d: 'M440,230 L480,210 L500,250 L460,280 L440,260 Z' },
];

const cityCoordinates = {
  // Domestic
  "Delhi": { x: 230, y: 155 },
  "Mumbai": { x: 125, y: 360 },
  "Chennai": { x: 280, y: 560 },
  "Bangalore": { x: 230, y: 510 },
  "Kolkata": { x: 420, y: 310 },
  "Hyderabad": { x: 270, y: 410 },
  "Pune": { x: 145, y: 380 },
  "Ahmedabad": { x: 95, y: 275 },
  "Jaipur": { x: 175, y: 200 },
  "Lucknow": { x: 295, y: 215 },
  
  // International
  "Dubai": { x: 40, y: 220 },
  "Doha": { x: 30, y: 200 },
  "Abu Dhabi": { x: 50, y: 210 },
  "Singapore": { x: 460, y: 450 },
  "London": { x: 50, y: 60 },
  "Paris": { x: 60, y: 80 },
  "Zurich": { x: 70, y: 70 },
  "Istanbul": { x: 90, y: 100 },
  "New York": { x: 20, y: 180 },
  "Los Angeles": { x: 15, y: 200 },
  "Tokyo": { x: 485, y: 130 },
  "Hong Kong": { x: 475, y: 200 },
  "Seoul": { x: 485, y: 170 },
  "Sydney": { x: 490, y: 550 },
  "Frankfurt": { x: 80, y: 90 },
};

export default function RouteMap() {
  const [flights, setFlights] = useState([]);
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'list'
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get("http://localhost:8000/flights", config);
      if (response.data?.success) {
        setFlights(response.data.flights || []);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Calculate route statistics
  const routeStats = flights.reduce((acc, flight) => {
    const route = `${flight.source}-${flight.destination}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});

  const topRoutes = Object.entries(routeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3, bgcolor: '#ffffff' }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A192F' }}>
            International & Domestic Routes ({flights.length})
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root.Mui-selected': {
                bgcolor: '#C9A962',
                color: '#0A192F',
                '&:hover': { bgcolor: '#B39155' }
              }
            }}
          >
            <ToggleButton value="map">
              <Map fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <List fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {viewMode === "map" ? (
          <Box sx={{ position: "relative", height: 450, bgcolor: "#f8f9fa", borderRadius: 4, overflow: "hidden", border: '1px solid rgba(201, 169, 98, 0.2)' }}>
            {loading && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                <Typography>Loading Routes...</Typography>
              </Box>
            )}
            <svg
              viewBox="0 0 500 600"
              style={{ width: "100%", height: "100%", filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.05))' }}
            >
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f1f4f9', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#cbd5e1', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Detailed India Map with States */}
              <g>
                {statePaths.map(state => (
                  <path
                    key={state.id}
                    d={state.d}
                    fill="url(#mapGradient)"
                    stroke="#C9A962"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                ))}
              </g>

              {/* Grid Lines for style */}
              <g opacity="0.05">
                {[...Array(11)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" stroke="#0A192F" strokeWidth="1" />
                ))}
                {[...Array(13)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#0A192F" strokeWidth="1" />
                ))}
              </g>

              {/* Flight routes */}
              {flights.map((flight, index) => {
                const sourceKey = Object.keys(cityCoordinates).find(k => k.toLowerCase() === flight.source?.toLowerCase());
                const destKey = Object.keys(cityCoordinates).find(k => k.toLowerCase() === flight.destination?.toLowerCase());
                
                const source = cityCoordinates[sourceKey];
                const dest = cityCoordinates[destKey];
                if (!source || !dest) return null;

                const isSelected = selectedRoute === flight._id;
                const isHighlighted = selectedRoute === null || isSelected;

                return (
                  <g key={flight._id || index}>
                    {/* Glowing Route line */}
                    <path
                      d={`M ${source.x} ${source.y} Q ${(source.x + dest.x) / 2} ${(source.y + dest.y) / 2 - 40} ${dest.x} ${dest.y}`}
                      fill="none"
                      stroke={isSelected ? "#FF6B35" : "#0052D4"}
                      strokeWidth={isSelected ? 3.5 : 1.5}
                      strokeDasharray={isSelected ? "none" : "4,2"}
                      opacity={isHighlighted ? (isSelected ? 1 : 0.6) : 0.05}
                      style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                      onClick={() => setSelectedRoute(isSelected ? null : flight._id)}
                      filter={isSelected ? "url(#glow)" : "none"}
                    />

                    {/* Animated dot on selected route */}
                    {isSelected && (
                      <circle r="5" fill="#FF6B35">
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          path={`M ${source.x} ${source.y} Q ${(source.x + dest.x) / 2} ${(source.y + dest.y) / 2 - 40} ${dest.x} ${dest.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* City markers */}
              {Object.entries(cityCoordinates).map(([city, coords]) => {
                const isConnected = flights.some(f => 
                  f.source?.toLowerCase() === city.toLowerCase() || 
                  f.destination?.toLowerCase() === city.toLowerCase()
                );
                if (!isConnected) return null;

                const isSelectionEndpoint = flights.find(f => 
                  f._id === selectedRoute && 
                  (f.source?.toLowerCase() === city.toLowerCase() || f.destination?.toLowerCase() === city.toLowerCase())
                );

                return (
                  <g key={city} style={{ cursor: 'pointer' }}>
                    <circle cx={coords.x} cy={coords.y} r={isSelectionEndpoint ? 15 : 10} fill={isSelectionEndpoint ? "#FF6B35" : "#0052D4"} opacity="0.15">
                      <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelectionEndpoint ? 6 : 4}
                      fill={isSelectionEndpoint ? "#FF6B35" : "#0052D4"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={coords.x}
                      y={coords.y - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill="#0A192F"
                      style={{ pointerEvents: 'none', textShadow: '0 0 3px white' }}
                    >
                      {city}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                bgcolor: "rgba(255,255,255,0.95)",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
                Click on routes to view details
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 20, height: 3, bgcolor: "#0052D4" }} />
                <Typography variant="caption">Active Routes</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 20, height: 3, bgcolor: "#FF6B35" }} />
                <Typography variant="caption">Selected Route</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          // List View
          <Box sx={{ height: 400, overflow: "auto" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Top Routes by Frequency
            </Typography>
            {topRoutes.map(([route, count], index) => {
              const [source, dest] = route.split("-");
              return (
                <Card
                  key={route}
                  sx={{
                    mb: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    bgcolor: index === 0 ? "primary.main" : "background.paper",
                    color: index === 0 ? "white" : "inherit",
                    boxShadow: index === 0 ? 4 : 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: index === 0 ? "white" : "primary.main", color: index === 0 ? "primary.main" : "white" }}>
                      {index + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {source} → {dest}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {count} flights per day
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    size="small"
                    icon={<TrendingUp fontSize="small" />}
                    label={`${count} flights`}
                    sx={{
                      bgcolor: index === 0 ? "rgba(255,255,255,0.2)" : "success.light",
                      color: index === 0 ? "white" : "success.dark",
                      fontWeight: 600,
                    }}
                  />
                </Card>
              );
            })}
          </Box>
        )}

        {/* Selected Route Details */}
        {selectedRoute && viewMode === "map" && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Route Details
            </Typography>
            {(() => {
              const flight = flights.find(f => f._id === selectedRoute);
              if (!flight) return null;
              return (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    icon={<LocationOn />}
                    label={`${flight.source} → ${flight.destination}`}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<FlightTakeoff />}
                    label={`Price: ₹${flight.price || flight.flight?.price || 0}`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<TrendingUp />}
                    label={`Duration: ${flight.duration || flight.flight?.duration || "--"}`}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              );
            })()}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
