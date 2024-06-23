// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/actions",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Type, Date" },
                ]
            },
            {
                source: "/api/mint",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "POST" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Type, Date" },
                ]
            }
        ]
    },
    optimizeFonts: false,
}

module.exports = nextConfig
