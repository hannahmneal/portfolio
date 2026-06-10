import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

export default function Frame({ children }) {

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                py: 6,
                px: 2,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    p: "25px",
                    background:
                        `linear-gradient(145deg, #F0E4D5 0%, #D8C5A6  30%, #D8C5A6  60%, #D9B792 100%)`,
                    borderRadius: "4px",
                    boxShadow: `${theme.shadows[5]}`
                    }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        p: "50px",
                        backgroundColor: `${theme.palette.primary.light}`,
                        borderRadius: "2px",
                        boxShadow: `${theme.shadows[15]}`,
                    }}
                >
                    <Box
                        sx={{
                            p: "30px",
                            backgroundColor: `${theme.palette.secondary.light}`,
                            borderRadius: "1px",
                            border: "1px solid rgba(0,0,0,0.08)",
                            boxShadow: `${theme.shadows[16]}`,
                        }}
                        >
                        <Box
                            sx={{
                                minWidth: { xs: "240px", sm: "360px" },
                                minHeight: "200px",
                                backgroundColor: `${theme.palette.common.white}`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1.5,
                                px: { xs: 3, sm: 6 },
                                py: 5,
                                border: `1px solid ${theme.palette.common.white}`,
                                borderRadius: "1px",
                                boxShadow: `${theme.shadows[16]}`,
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}