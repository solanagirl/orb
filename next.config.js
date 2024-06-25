// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/actions",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,OPTIONS" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Content-Encoding, Accept-Encoding"}
                ]
            },
            {
                source: "/api/mint",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,OPTIONS" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Content-Encoding, Accept-Encoding"}
                ]
            },            {
                source: "/api/donate",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,OPTIONS" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Content-Encoding, Accept-Encoding"}
                ]
            }
        ]
    },
    optimizeFonts: false,
}

module.exports = nextConfig
