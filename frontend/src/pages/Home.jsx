import { useTheme } from '@mui/material/styles'
import { Window } from "../components/Window"

export default function Home() {
  const theme = useTheme();
  return (
    <>
      <h1 style={{ font: theme.typography.h1.fontFamily }}>Home</h1>
      <Window title="Title"><p>I am the content!</p></Window>
    </>
  )
}
