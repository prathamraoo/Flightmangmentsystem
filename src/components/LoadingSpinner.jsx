import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { FlightTakeoff } from "@mui/icons-material";

export default function LoadingSpinner({ message = "Loading...", size = 40 }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Box sx={{ position: 'relative', mb: 2 }}>
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <FlightTakeoff
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.primary.main,
              fontSize: size * 0.4,
            }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Paper>
    </Box>
  );
}

// Full screen loading overlay
export function LoadingOverlay({ message = "Loading..." }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          minWidth: 300,
        }}
      >
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h6" sx={{ mb: 1 }}>
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait...
        </Typography>
      </Paper>
    </Box>
  );
}