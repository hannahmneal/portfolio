import { useTheme } from '@mui/material/styles'
import { Button, ButtonPrimary } from '../components/Buttons';
import { Window } from '../components/Window'

export default function About() {
  const theme = useTheme();

  return (
    <>
      <h1 style={{ font: theme.typography.h1.fontFamily }}>About</h1>
      <Window title="Title">
          <p>I am the content!</p>
          <Button
            sx={{
              bgColor: theme.palette.primary.main
            }}
          >
            Button label
          </Button>
          <ButtonPrimary>Primary button</ButtonPrimary>
      </Window>
    </>
  )
}
