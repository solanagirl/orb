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
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Content-Type", value: "application/json" },
                    { key: "Content-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Encoding, Content-Type, Date" },
                ]
            },
            {
                source: "/api/mint",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Encoding, Content-Type, Date" },
                ]
            },            {
                source: "/api/donate?amount=",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, 
                    { key: "Access-Control-Allow-Methods", value: "*" },
                    { key: "Accept-Encoding", value: "compress" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-Encoding, Content-Type, Date" },
                ]
            }
        ]
    },
    optimizeFonts: false,
}

module.exports = nextConfig
