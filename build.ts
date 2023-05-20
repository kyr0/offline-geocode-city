import { buildForNode } from '@jsheaven/easybuild'
import chokidar from 'chokidar'

const buildTargets = ['index', 'codegen']

const buildDeployable = async (target: string) => buildForNode({
    entryPoint: `./src/${target}.ts`,
    outfile: `./dist/${target}.js`,
    debug: false,
    dts: true,
    esBuildOptions: {
        bundle: true,
    },
})

for (const target of buildTargets) {
    await buildDeployable(target)
}

if (process.env.WATCH_API) {
    chokidar
        .watch(buildTargets.map(target => `./src/${target}.ts`))
        .on('change', async (path) => {
            console.log('Change found in ' + path)
            const target = buildTargets.find(target => path.includes(target)) as string
            await buildDeployable(target)
        })
}
