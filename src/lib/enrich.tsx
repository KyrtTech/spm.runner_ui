import { InfraProvider, Service } from '@/sdk';
import * as $rdf from 'rdflib';

export interface ResolvedNode {
    uri: string;
    name: string;
    desc?: string;
}

const store = $rdf.graph();

export interface ResolvedInfraProvider extends InfraProvider {
    config: (InfraProvider['config'][0] & ResolvedNode)[]/*{
      values: (InfraProvider['config']['values'] & ResolvedNode)[]
    }*/
}

export interface ResolvedService extends Service {
    dependsOn: (Service['dependsOn'][0] & ResolvedNode)[]
}

export const enrichInfraProvider = async (provider: InfraProvider): Promise<ResolvedInfraProvider> => {
    const config = await Promise.all(provider.config.map(async config => {
        try {
            const response = await fetch(config.name);
            const ttlData = await response.text();
            $rdf.parse(ttlData, store, config.name, 'text/turtle');
        } catch (e) {
            console.log(e);
        }

        const infoURI = $rdf.sym(config.name);
        const label = store.any(infoURI, $rdf.sym('http://www.w3.org/2000/01/rdf-schema#label'));
        const comment = store.any(infoURI, $rdf.sym('http://www.w3.org/2000/01/rdf-schema#comment'));

        return {
            ...config,
            uri: config.name,
            name: label?.toString() || config.name,
            desc: comment?.toString(),
        }
    }));

    return {
        ...provider,
        config
    };
}

export const enrichService = async (service: Service): Promise<ResolvedService> => {
    const dependsOn = await Promise.all(service.dependsOn.map(async dependency => {
        try {
            const response = await fetch(dependency.uri);
            const ttlData = await response.text();
            $rdf.parse(ttlData, store, dependency.uri, 'text/turtle');
        } catch (e) {
            console.log(e);
        }

        const infoURI = $rdf.sym(dependency.uri);
        const comment = store.any(infoURI, $rdf.sym('http://purl.org/dc/terms/description'));
        const logo = store.any(infoURI, $rdf.sym('http://schema.org/logo'))?.value;

        return {
            ...dependency,
            desc: comment?.toString(),
            logo
        }
    }))

    return {
        ...service,
        dependsOn
    }
}