import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Decorative box at either end of the title bar.
function TitleBox() {
    const theme = useTheme()
    // 👇🏻 declared `window: win` to avoid shadowing the browser's global `window` inside this component.
    const { window: win, titleBar, button } = theme.custom
    return (
        <Box
            aria-hidden="true"
            sx={{
                flex: 'none',
                width: titleBar.boxSize,
                height: titleBar.boxSize,
                bgcolor: button.bg,
                border: `1px solid ${win.border}`,
                boxShadow: button.shadow,
            }}
        />
    )
}

// Pinstriped filler that stretches between a box and the title.
function TitleStripes() {
    const theme = useTheme()
    const { titleBar } = theme.custom
    return (
        <Box
            aria-hidden="true"
            sx={{
                flex: 1,
                alignSelf: 'stretch',
                my: '6px', // keeps the stripes inset from the top/bottom of the bar
                background: titleBar.pinstripes,
            }}
        />
    )
}


export function Window({ title, children }) {
    const theme = useTheme()
    // 👇🏻 declared `window: win` to avoid shadowing the browser's global `window` inside this component.
    const { window: win, titleBar } = theme.custom

    return (
        <Box
            sx={{
                background: win.bg,
                border: `1px solid ${win.border}`,
                borderRadius: win.borderRadius,
                // 👇🏻 `.filter(Boolean)` drops the border ring in light mode, where it's undefined.
                boxShadow: [win.shadow, win.borderRing].filter(Boolean).join(', '),
                m: win.margin,
                minHeight: 240,
                minWidth: 240,
                overflow: 'hidden',
            }}
        >
            <Box
                className="window_title_container"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // space between box, stripes and title
                    px: '8px', // space between the window edge and the boxes
                    height: titleBar.height,
                    backgroundColor: titleBar.bg,
                    borderBottom: `1px solid ${win.border}`,
                }}
            >
                <TitleBox />
                <TitleStripes />
                <Typography
                    variant="subtitle1"
                    component="p"
                    sx={{ m: 0, flex: 'none', color: titleBar.text }}
                >
                    {title}
                </Typography>
                <TitleStripes />
                <TitleBox />
            </Box>
                {children}
        </Box>
    )
}
