module.exports = {
    apps: [
        {
            name: 'PainCoach',
            port: 8003,
            exec_mode: 'cluster',
            instances: '1',
            script: './.output/server/index.mjs',
        }
    ]
}