function requireApiToken(req, res, next) {
    const [scheme, api_token] = (req.headers.authorization ?? "").split(" ")
    
        if (scheme !== "Bearer " || !api_token || api_token !== process.env.BIOINF_VAP_TOKEN) {
            return res.status(401).json({ error: "Unauthorized" })
        }
}