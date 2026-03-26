import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  useTheme,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh,
  Home,
} from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo, onRetry, onGoHome }) {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.error.main + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 40,
                color: theme.palette.error.main,
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.error.main,
            }}
          >
            Oops! Something went wrong
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            We encountered an unexpected error. Our team has been notified and
            we're working to fix it. Please try refreshing the page or go back home.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onRetry}
              sx={{
                minWidth: 140,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Try Again
            </Button>

            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={onGoHome}
              sx={{
                minWidth: 140,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.primary.main + '10',
                },
              }}
            >
              Go Home
            </Button>
          </Box>

          {import.meta.env.DEV && error && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.error.main }}>
                Error Details (Development Only):
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  border: `1px solid ${theme.palette.error.light}`,
                  borderRadius: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2" component="pre" sx={{ m: 0 }}>
                  {error.toString()}
                  {errorInfo.componentStack}
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default ErrorBoundary;