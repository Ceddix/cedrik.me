import type { NextConfig } from "next";
import { SITE_CONFIG } from "./app/lib/config";

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
    },
    cacheComponents: true,
    async redirects() {
        return [
            {
                source: '/github',
                destination: SITE_CONFIG.socials.github,
                permanent: true,
            },
            {
                source: '/spotify',
                destination: SITE_CONFIG.socials.spotify,
                permanent: true,
            },
            {
                source: '/instagram',
                destination: SITE_CONFIG.socials.instagram,
                permanent: true,
            },
            {
                source: '/threads',
                destination: SITE_CONFIG.socials.threads,
                permanent: true,
            },
            {
                source: '/discord',
                destination: SITE_CONFIG.socials.discord,
                permanent: true,
            },
            {
                source: '/linkedin',
                destination: SITE_CONFIG.socials.linkedin,
                permanent: true,
            },
            {
                source: '/donate',
                destination: SITE_CONFIG.socials.donate,
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
