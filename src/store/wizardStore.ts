import { create } from 'zustand'
import { ResolvedInfraProvider, ResolvedService } from '@/lib/enrich'
import { SDK } from '@/sdk'

export type EnvVar = {
    name: string;
    value: string;
};

interface WizardState {
    // Selected values
    selectedInfraProvider: ResolvedInfraProvider | null
    selectedService: ResolvedService | null
    projectName: string
    environment: string
    sdk: SDK | null
    envVars: EnvVar[];

    // Actions
    setInfraProvider: (provider: ResolvedInfraProvider | null) => void
    setService: (service: ResolvedService | null) => void
    setProjectDetails: (name: string, env: string) => void
    setSDK: (sdk: SDK) => void
    setEnvVars: (vars: EnvVar[]) => void
    resetWizard: () => void
}

export const useWizardStore = create<WizardState>((set) => ({
    // Initial state
    selectedInfraProvider: null,
    selectedService: null,
    projectName: '',
    environment: '',
    runnerEndpoint: '',
    sdk: null,
    envVars: [],

    // Actions
    setInfraProvider: (provider) => set({ selectedInfraProvider: provider }),
    setService: (service) => set({ selectedService: service }),
    setProjectDetails: (name, env) => set({ 
        projectName: name, 
        environment: env 
    }),
    setSDK: (sdk) => set({
        sdk
    }),
    setEnvVars: (vars: EnvVar[]) => set({
        envVars: vars
    }),
    resetWizard: () => set({ 
        selectedInfraProvider: null,
        selectedService: null,
        projectName: '',
        environment: ''
    })
})) 