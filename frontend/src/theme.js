import { createTheme } from '@mui/material/styles';

const dmSans = '"DM Sans", "Helvetica Neue", Arial, sans-serif'

const theme = createTheme({
    components: {},
    mixins: {},
    palette: {
        background: {
            light: "#DEE2E3",
            main: "#68767C",
            dark: "#2E3538",
        },
        primary: {
            light: "#EDE7D9",
            main: "#D8C5A6",
            dark: "#D9B792",
        },
        secondary: {
            light: "#F5F0E8",
            main: "#F0E4D5", 
            dark: "#D8C5A6",
        },
        error: {
            light: "#FF6663",
            main: "#FE5F55",
            dark: "#550C18",
        },
        success: {
            light: "#2BC597",
            main: "#1B6553",
            dark: "#002626",
        },
        info: {
            main: "#6AC3F6",
            dark: "#0A369D",
        },
        common: {
            grayLightPrimary: "#BDBFCB",
            grayDarkPrimary: "#1F3942",
            grayMainSecondary: "#404040",
            parchment: "#EFE8DC",
            porcelain1: "#F2EDE3",
            skylight: "#F1F2F6",
            linen: "#F3ECE3",
            softLinen: "#F3ECE3",
            shadowGrey: "#3A2E39",
            chocolatePlum: "#404040",
            graphite: "#2F2D2E",
            onyx: "#0A090C",
            white: "#fff9f5f0",
            dark: "#1C2021"
        },
        text: {
            light: "#9a8a78",
            dark: "#1C2021"

        },
    },
    shadows: [
        'none',
        '0 1px 4px rgba(46,53,56,0.28), inset 0 1px 0 rgba(224,220,221,0.50)',
        '0 3px 10px rgba(46,53,56,0.34), inset 0 1px 0 rgba(224,220,221,0.65)',
        '0 4px 14px rgba(46, 56, 55, 0.4), inset 0 1px 0 rgba(223, 224, 220, 0.72)',
        '0 6px 22px rgba(46,53,56,0.42), inset 0 1px 0 rgba(224,220,221,0.80)',
        '0 7px 24px rgba(46,53,56,0.43), inset 0 1px 0 rgba(224,220,221,0.81)',
        '0 8px 26px rgba(46,53,56,0.44), inset 0 1px 0 rgba(224,220,221,0.82)',
        '0 9px 28px rgba(46,53,56,0.45), inset 0 1px 0 rgba(224,220,221,0.83)',
        '0 12px 40px rgba(46,53,56,0.50), inset 0 1px 0 rgba(255,252,250,0.90)',
        '0 13px 42px rgba(46,53,56,0.51), inset 0 1px 0 rgba(255,252,250,0.91)',
        '0 14px 44px rgba(46,53,56,0.51), inset 0 1px 0 rgba(255,252,250,0.91)',
        '0 15px 46px rgba(46,53,56,0.52), inset 0 1px 0 rgba(255,252,250,0.92)',
        '0 16px 48px rgba(46,53,56,0.52), inset 0 1px 0 rgba(255,252,250,0.92)',
        '0 17px 50px rgba(46,53,56,0.53), inset 0 1px 0 rgba(255,252,250,0.92)',
        '0 18px 52px rgba(46,53,56,0.53), inset 0 1px 0 rgba(255,252,250,0.93)',

        'inset 0 3px 8px rgba(46, 56, 53, 0.2), inset 3px 0 6px rgba(46,53,56,0.10), inset 0 -1px 3px rgba(250, 250, 255, 0.54)',
        'inset 2px 2px 10px rgba(46,53,56,0.24), inset -1px -1px 4px rgba(255,252,250,0.35)',
        'inset 0 1px 4px rgba(46,53,56,0.07)'
    ],
    transitions: {},
    typography: {
        fontFamily: dmSans,
        h1: {
            fontFamily: dmSans,
            fontSize: '3.5rem',  // 56px
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "0.04em",
            color: "#2F2D2E",  // graphite
        },
        h2: {
            fontFamily: dmSans,
            fontSize: '2.5rem',
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
            color: "#2F2D2E",  // graphite
        },
        h3: {
            fontFamily: dmSans,
            fontSize: '1.875rem',     // 30px — card/subsection titles
            fontWeight: 500,
            lineHeight: 1.25,
            color: "#2F2D2E",  // graphite
        },
        h4: {
            fontFamily: dmSans,
            fontSize: '1.375rem',     // 22px — smaller titled sections
            fontWeight: 500,
            lineHeight: 1.3,
            color: "#2F2D2E",  // graphite
        },
        h5: {
            fontFamily: dmSans,
            fontSize: '1.125rem',     // 18px
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#0A090C",
        },
        h6: {
            fontFamily: dmSans,
            fontSize: '1rem',         // 16px
            fontWeight: 700,
            lineHeight: 1.4,
            color: "#0A090C",
        },
        subtitle1: {
            fontFamily: dmSans,
            fontSize: '1.125rem',     // 18px — large descriptive text under headings
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            color: "#9a8a78"  // text.light
        },
        subtitle2: {
            fontFamily: dmSans,
            fontSize: '0.875rem',     // 14px — secondary metadata labels
            fontWeight: 700,
            // lineHeight: 1.5,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: "#9a8a78",  // text.light
        },
        body1: {
            fontFamily: dmSans,
            fontSize: '1rem',         // 16px — primary readable text
            fontWeight: 400,
            lineHeight: 1.7,          // generous line-height for readability
            color: "#2F2D2E",  // graphite on light backgrounds: ~7.5:1 contrast, AAA
        },
        body2: {
            fontFamily: dmSans,
            fontSize: '0.875rem',     // 14px — secondary/supporting text
            fontWeight: 400,
            lineHeight: 1.65,
            color: "#2F2D2E",  // graphite
        },
        caption: {
            fontFamily: dmSans,
            fontSize: '0.75rem',      // 12px — image captions, fine print
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            color: "#68767C",               // only use at this size on dark or high-contrast backgrounds
        },
        button: {
            fontFamily: dmSans,
            fontSize: '0.875rem',     // 14px
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
        },
    }
});

export default theme;