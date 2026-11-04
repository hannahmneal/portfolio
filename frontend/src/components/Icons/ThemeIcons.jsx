import { useTheme } from '@mui/material/styles'

export function MoonIcon() {
    const theme = useTheme()
    const { titleBar } = theme.custom
    return (
        <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
        >
            <rect x="5" y="1" width="5" height="2" fill={titleBar.text} />
            <rect x="3" y="3" width="4" height="2" fill={titleBar.text} />
            <rect x="2" y="5" width="4" height="6" fill={titleBar.text} />
            <rect x="3" y="11" width="4" height="2" fill={titleBar.text} />
            <rect x="5" y="13" width="7" height="2" fill={titleBar.text} />
            <rect x="11" y="11" width="3" height="2" fill={titleBar.text} />
        </svg>
    )
}

export function SunIcon() {
    const theme = useTheme()
    const { titleBar } = theme.custom
    return (
        <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
        >
            {/* Body (octagon) */}
            <rect x="5" y="4" width="6" height="8" fill={titleBar.text} />
            <rect x="4" y="5" width="8" height="6" fill={titleBar.text} />
            {/* Cardinal rays */}
            <rect x="7" y="0" width="2" height="2" fill={titleBar.text} />
            <rect x="7" y="14" width="2" height="2" fill={titleBar.text} />
            <rect x="0" y="7" width="2" height="2" fill={titleBar.text} />
            <rect x="14" y="7" width="2" height="2" fill={titleBar.text} />
            {/* Diagonal rays */}
            <rect x="2" y="2" width="2" height="2" fill={titleBar.text} />
            <rect x="12" y="2" width="2" height="2" fill={titleBar.text} />
            <rect x="2" y="12" width="2" height="2" fill={titleBar.text} />
            <rect x="12" y="12" width="2" height="2" fill={titleBar.text} />
        </svg>
    )
}