import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ResolvedService } from '@/lib/enrich';
import { getFileIconClass } from '@/lib/utils';



interface ServiceCardProps {
    service: ResolvedService;
    isSelected: boolean;
    onSelect: (name: string) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    const [showDependencies, setShowDependencies] = useState<boolean>(false);

    return (
        <Card 
            className={isSelected ? 'border-2 border-blue-500' : ''} 
            onClick={() => onSelect(service.name)} 
            style={{ cursor: 'pointer' }}
        >
            <CardHeader>
                <CardTitle className="flex items-center">
                    <span>{service.name}</span>
                    <img src={service.logo} alt={`${service.name} logo`} className="object-contain w-10 h-10 ml-4" />
                    {isSelected && (
                        <div className='ml-auto'>
                            <span className='text-xs text-white bg-blue-500 px-2 py-1 rounded-full'>Selected</span>
                        </div>
                    )}
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
                                            <div>
                                                <span>{dependency.name} (v{dependency.version})</span>
                                                <p className='text-xs text-gray-400'>{dependency.desc}</p>
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