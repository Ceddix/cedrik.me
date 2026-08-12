/** @type {import('next').NextConfig} */
module.exports = {
    async redirects() {
        return [
            {
                source: '/github',
                destination: 'https://github.com/ceddix/',
                permanent: true,
            },
            {
                source: '/spotify',
                destination: 'https://open.spotify.com/user/2fy35e57mzi84b2zhafnu7t5r?si=b11fa648285e413f',
                permanent: true,
            },
            {
                source: '/instagram',
                destination: 'https://instagram.com/cedrik.sc_',
                permanent: true,
            },
            {
                source: '/threads',
                destination: 'https://threads.net/cedrik.sc_',
                permanent: true,
            },
            {
                source: '/discord',
                destination: 'https://discord.com/users/463620307245072384',
                permanent: true,
            },
            {
                source: '/linkedin',
                destination: 'https://www.linkedin.com/in/cedrik-secic/',
                permanent: true,
            },
            {
                source: '/donate',
                destination: 'https://paypal.me/cedriksc',
                permanent: true,
            },
        ]
    },
}
