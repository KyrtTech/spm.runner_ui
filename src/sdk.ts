// Define and export the Strategy interface
interface SupportFile {
    accessUrl: string
    localPath: string
}

interface Param {
    name?: string
    type?: string
    minValue?: string
    recommendedValue?: string
    spmParam?: string
    param?: string
    description?: string
}

export interface Strategy {
    title: string
    description: string
    uri: string
    scripts: string[]
    uninstallScripts: string[] | null
    supportFiles: SupportFile[]
    downloadURL: string | null
    runner: string | null
    optionalParams: Param[]
    requirementParams: Param[]
    alternatives: Strategy[]
}

export interface EnvVar {
    key: string
    value: string
}

export async function getInstallPlan(): Promise<Strategy[]> {
    const endpoint = `${import.meta.env.VITE_API_URL}/job`;

    if (!endpoint) {
        throw new Error('API_URL is not defined')
    }
    const response = await fetch(endpoint)
    if (!response.ok) {
        throw new Error('Failed to fetch strategies')

    }
    const strategies: Strategy[] = await response.json()
    return strategies
}

export async function startPlan(): Promise<void> {
    const endpoint = `${import.meta.env.VITE_API_URL}/start-job`;

    if (!endpoint) {
        throw new Error('API_URL is not defined')
    }
    const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to start plan')
    }
}
export async function getPlanEnvVars(): Promise<EnvVar[]> {
    const endpoint = `${import.meta.env.VITE_API_URL}/envs`;

    if (!endpoint) {
        throw new Error('API_URL is not defined')
    }
    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error('Failed to fetch environment variables')
    }

    const envVarsMap: Record<string, string> = await response.json();
    const envVars: EnvVar[] = Object.entries(envVarsMap).map(([key, value]) => ({
        key,
        value
    }));

    return envVars;
}

export async function updateEnvVars(envVars: EnvVar[]): Promise<void> {
    const endpoint = `${import.meta.env.VITE_API_URL}/envs`;

    if (!endpoint) {
        throw new Error('API_URL is not defined')
    }

    await fetch(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(envVars.map(({ key, value }) => [key, value]))),
    });

}   