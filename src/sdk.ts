const endpoint = `${import.meta.env.VITE_API_URL}/job`;

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

export async function getInstallPlan(): Promise<Strategy[]> {
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