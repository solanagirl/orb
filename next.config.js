// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/actions",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                    { key: "Accept-Encoding", value: "compress" },
                ]
            },
            {
                source: "/api/mint",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                ]
            },            {
                source: "/api/donate",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                ]
            }
        ]
    },
    optimizeFonts: false,
}

module.exports = nextConfig
