import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Pagination,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  Schedule,
  CheckCircle,
  Cancel,
  Refresh,
  Warning,
  Flight,
  ArrowForward,
} from "@mui/icons-material";

export default function FlightStatusTracker() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/flights", config);
      if (response.data?.success) {
        // Enrich flight data with simulated status
        const enrichedFlights = response.data.flights?.map((flight, index) => ({
          ...flight,
          status: getFlightStatus(index),
          progress: getFlightProgress(index),
          passengers: Math.floor(Math.random() * 150) + 50,
          gate: `G${Math.floor(Math.random() * 20) + 1}`,
        })) || [];
        setFlights(enrichedFlights);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate flight status based on index
  const getFlightStatus = (index) => {
    const statuses = ["On Time", "In Air", "Landed", "Delayed", "Boarding"];
    return statuses[index % statuses.length];
  };

  // Simulate flight progress
  const getFlightProgress = (index) => {
    const progress = [100, 65, 0, 0, 10];
    return progress[index % progress.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Time":
      case "Landed":
        return "success";
      case "In Air":
        return "info";
      case "Boarding":
        return "warning";
      case "Delayed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "On Time":
        return <CheckCircle fontSize="small" />;
      case "Delayed":
        return <Warning fontSize="small" />;
      case "Boarding":
        return <FlightTakeoff fontSize="small" />;
      case "In Air":
        return <Flight fontSize="small" />;
      case "Landed":
        return <FlightLand fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedFlights = flights.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Flight Status Tracker
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchFlights} disabled={loading}>
              <Refresh sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Flight</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gate</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Passengers</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFlights.map((flight) => (
                <TableRow key={flight._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                        <FlightTakeoff fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {flight.flightNumber || "SKY" + Math.floor(Math.random() * 999)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="body2">{flight.source}</Typography>
                      <ArrowForward fontSize="small" color="action" />
                      <Typography variant="body2">{flight.destination}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={getStatusIcon(flight.status)}
                      label={flight.status}
                      color={getStatusColor(flight.status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {flight.gate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {flight.passengers}/{flight.capacity || 180}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: 100 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={flight.progress}
                        sx={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "grey.200",
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {flight.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(flights.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
