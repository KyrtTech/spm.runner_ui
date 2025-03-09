// Define and export the Strategy interface
interface SupportFile {
  accessUrl: string;
  localPath: string;
}

interface Param {
  name?: string;
  type?: string;
  minValue?: string;
  recommendedValue?: string;
  spmParam?: string;
  param?: string;
  description?: string;
}

export interface Strategy {
  title: string;
  description: string;
  uri: string;
  scripts: string[];
  uninstallScripts: string[] | null;
  supportFiles: SupportFile[];
  downloadURL: string | null;
  runner: string | null;
  optionalParams: Param[];
  requirementParams: Param[];
  alternatives: Strategy[];
}

export interface EnvVar {
  key: string;
  value: string;
}

export interface InfraConfigValue {
  name: string;
  uri: string;
}

export interface InfraConfig {
  name: string;
  isBuildable: boolean;
  values: InfraConfigValue[];
}
export interface InfraProvider {
  name: string;
  title: string;
  description: string;
  logo: string;
  config: InfraConfig[];
}

export interface ServiceDependency {
  name: string;
  uri: string;
  logo?: string;
  version: string;
}

export interface Service {
  name: string;
  description?: string;
  logo: string;
  version: string;
  downloadUrl: string;
  dependsOn: ServiceDependency[];
}

export interface SDK {
  getInstallPlan: () => Promise<Strategy[]>;
  startPlan: () => Promise<void>;
  getPlanEnvVars: () => Promise<EnvVar[]>;
  updateEnvVars: (envs: EnvVar[]) => Promise<void>;

  endpoint: () => string;
}

export const generateSKDWithEndpoint = (prefix: string): SDK => {
  return {
    endpoint: () => prefix,
    getInstallPlan: async (): Promise<Strategy[]> => {
      const endpoint = `${prefix}/job`;

      if (!endpoint) {
        throw new Error("RUNNER_API_URL is not defined");
      }
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch strategies");
      }
      const strategies: Strategy[] = await response.json();
      return strategies;
    },
    startPlan: async (): Promise<void> => {
      const endpoint = `${prefix}/start-job`;

      if (!endpoint) {
        throw new Error("RUNNER_API_URL is not defined");
      }
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to start plan");
      }
    },
    getPlanEnvVars: async (): Promise<EnvVar[]> => {
      const endpoint = `${prefix}/envs`;

      if (!endpoint) {
        throw new Error("RUNNER_API_URL is not defined");
      }
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch environment variables");
      }

      const envVarsMap: Record<string, string> = await response.json();
      const envVars: EnvVar[] = Object.entries(envVarsMap).map(
        ([key, value]) => ({
          key,
          value,
        })
      );

      return envVars;
    },
    updateEnvVars: async (envVars: EnvVar[]): Promise<void> => {
      const endpoint = `${prefix}/envs`;

      if (!endpoint) {
        throw new Error("RUNNER_API_URL is not defined");
      }

      await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(envVars.map(({ key, value }) => [key, value]))
        ),
      });
    },
  };
};

export async function getInfraProviders(): Promise<InfraProvider[]> {
  const endpoint = `${import.meta.env.VITE_REGISTRY_API_URL}/infra-providers`;

  if (!endpoint) {
    throw new Error("REGISTRY_API_URL is not defined");
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error while getting infra providers");
  }

  return response.json();
}

export async function getServices(): Promise<Service[]> {
  const endpoint = `${import.meta.env.VITE_REGISTRY_API_URL}/services`;

  if (!endpoint) {
    throw new Error("REGISTRY_API_URL is not defined");
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error while getting services");
  }

  return response.json();
}

export async function startRunner(infra: string, app: string): Promise<string> {
  const endpoint = `${import.meta.env.VITE_RUNNER_ORCHESTRATOR_API_URL}/start`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      infra,
      app,
    }),
  });

  const body = await response.json();

  return body.endpoint;
}
