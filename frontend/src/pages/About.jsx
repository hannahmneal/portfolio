import { useTheme } from '@mui/material/styles'
import { PrimaryButton, SecondaryButton, GhostButton } from '../components/Buttons';
import { Window } from '../components/Window'

export default function About() {
  const theme = useTheme();

  return (
    <>
      <h1 style={{ font: theme.typography.h1.fontFamily }}>About</h1>
      <Window title="Title">
          <p>I am the content!</p>
          <PrimaryButton>Primary button</PrimaryButton>
          <SecondaryButton>Secondary button</SecondaryButton>
          <GhostButton>Ghost button</GhostButton>
          <PrimaryButton disabled>"I'm disabled" primary button</PrimaryButton>
          <SecondaryButton disabled>"I'm disabled" secondary button</SecondaryButton>
          <GhostButton disabled>"I'm disabled" ghost button</GhostButton>
      </Window>
    </>
  )
}
