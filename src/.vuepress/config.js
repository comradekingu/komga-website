module.exports = {
    title: 'Komga',
    description: 'Free and open source comics/mangas server',
    dest: './public',
    themeConfig: {
        repo: 'gotson/komga',
        docsRepo: 'gotson/komga-website',
        docsDir: 'src',
        logo: '/assets/media/logo.svg',
        editLinks: true,
        editLinkText: 'Help us improve this page',
        nav: [
            {
                text: 'Features',
                link: '/features/'
            },
            {
                text: 'Installation',
                link: '/installation/'
            },
            {
                text: 'Configuration',
                link: '/configuration/'
            },
            {
                text: 'Client Applications',
                link: '/clients/tachiyomi'
            },
            {
                text: 'API',
                link: '/api/rest'
            },
            {
                text: 'Discord',
                link: 'https://discord.gg/TdRpkDu'
            }
        ],
        sidebar: [
            '',
            '/features/',
            {
                title: 'Installation',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    ['/installation/', 'Getting started'],
                    '/installation/jar',
                    '/installation/docker',
                    '/installation/user-accounts'
                ]
            },
            '/configuration/',
            {
                title: 'Client Applications',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/clients/tachiyomi',
                    '/clients/opds'
                ]
            },
            {
                title: 'API',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '/api/rest',
                    '/api/opds'
                ]
            }
        ],
        lastUpdated: 'Last Updated'
    }
}