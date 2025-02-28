import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResolvedService } from '@/lib/enrich';
import { getFileIconClass } from '@/lib/utils';
import { useWizardStore } from '@/store/wizardStore'

interface ServiceCardProps {
    service: ResolvedService;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const { setService, selectedService } = useWizardStore()
    const [showDependencies, setShowDependencies] = useState<boolean>(false);

    return (
        <Card
            className={selectedService?.name === service.name ? 'border-2 border-blue-500' : ''}
        >
            <CardHeader>
                <CardTitle className="flex items-center">
                    <span>{service.name}</span>
                    <img src={service.logo} alt={`${service.name} logo`} className="object-contain w-10 h-10 ml-4" />
                    <div className='ml-auto flex items-center space-x-2'>
                        <Switch id={service.name} checked={selectedService?.name === service.name} onClick={() => setService(service)} />
                        <Label htmlFor={service.name} className='cursor-pointer'>Select</Label>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-gray-500'>Version: {service.version}</p>
                <p className='text-sm text-gray-500'>{service.description}</p>
                <p className='text-sm text-gray-500'>
                    {service.downloadUrl && (
                        <>
                            Download link:
                            <a href={service.downloadUrl} target="_blank" rel="noopener noreferrer" className='float-right items-center flex'>
                                {service.downloadUrl.split("/")[service.downloadUrl.split("/").length - 1]}
                                <span className='float-right'>{getFileIconClass(service.downloadUrl)}</span>
                            </a>
                        </>
                    )}
                </p>
                {service.dependsOn.length > 0 && (
                    <div className='mt-4'>
                        <Collapsible open={showDependencies} onOpenChange={setShowDependencies}>
                            <CollapsibleTrigger asChild>
                                <h3 className='text-sm font-bold cursor-pointer flex items-center'>
                                    Dependencies <ChevronsUpDown className="h-4 w-4" />
                                </h3>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <ul className='list-disc'>
                                    {service.dependsOn.map((dependency) => (
                                        <li key={dependency.uri} className='text-sm text-gray-500'>
                                            <div className='flex items-start flex-col'>
                                                <div className='flex items-center'>
                                                    {dependency.logo && (
                                                        <img src={dependency.logo} alt={`${dependency.name} logo`} className="object-contain w-6 h-6 mr-2" />
                                                    )}
                                                    <span>{dependency.name} (v{dependency.version})</span>
                                                </div>
                                                <p className='text-xs text-gray-400 mt-1'>{dependency.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 