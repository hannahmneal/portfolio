// import { useEffect, useState } from 'react'
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import createEmotionCache from './createEmotionCache.js'
import './App.css'
import { Avatar, Box, Button, Container, Divider, Grid, Paper, Skeleton, TextField, Typography } from '@mui/material';
import Frame from './components/frame.jsx';

// TODO: if dev, API_URL = local; else, API_URL = prod
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

export default function App() {
  const cache = createEmotionCache();

  // TODO: Un-comment when backend/API is ready:
  
  // const [status, setStatus] = useState(null)

  // useEffect(() => {
  //   fetch(`${API_URL}/health`)
  //     .then(r => r.json())
  //     .then(d => setStatus(d.status))
  //     .catch(() => setStatus("unreachable"))
  // }, [])

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Frame>
          <Typography typography={theme.typography.subtitle2}>
            — Portfolio —
          </Typography>
          <Typography
            typography={theme.typography.h1}
          >
            Coming soon!
          </Typography>
          <Box
            sx={{
              width: "48px",
              height: "1px",
              backgroundColor: `${theme.palette.primary.main}`,
              mt: 0.5,
            }}
          />
          <Typography typography={theme.typography.subtitle1}
          >
            This is the home of my professional portfolio.
          </Typography>
        </Frame>
      </ThemeProvider>
    </CacheProvider>
  )
}
