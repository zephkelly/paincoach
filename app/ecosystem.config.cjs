module.exports = {
    apps: [
        {
            name: 'PainCoach App',
            port: 8004,
            exec_mode: 'cluster',
            instances: '1',
            script: './.output/server/index.mjs',
        }
    ]
}