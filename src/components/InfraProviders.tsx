import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { getInfraProviders } from '@/sdk';
import { enrichInfraProvider, ResolvedInfraProvider } from '@/lib/enrich';

export default function InfraProvidersList() {
    const { data, error, isLoading } = useQuery({ queryKey: ['infraProviders'], queryFn: getInfraProviders });
    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
    const [infraProviders, setInfraProviders] = useState<ResolvedInfraProvider[]>();
    const [selectedProvider, setSelectedProvider] = useState<string>('');

    useEffect(() => {
        if (!data) {
            return;
        }

        const enrich = async () => {
            const infraProviders = await Promise.all(data.map(enrichInfraProvider))
            setInfraProviders(infraProviders);
        };

        enrich();
    }, [data]);

    if (isLoading || !infraProviders) return <p>Loading providers...</p>;
    if (error) return <p>Error loading providers.</p>;

    return (
        <div className='p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {infraProviders?.map((provider) => (
                    <Card key={provider.name} className={selectedProvider === provider.name ? 'border-2 border-blue-500' : ''} onClick={() => setSelectedProvider(provider.name)} style={{cursor: 'pointer'}}>
                        <CardHeader>
                            <div className='flex items-center gap-4'>
                                <Avatar>
                                    <img src={provider.logo} alt={provider.name} className='w-10 h-10 rounded-full' />
                                </Avatar>
                                <CardTitle>{provider.name}</CardTitle>
                                {selectedProvider === provider.name && (
                                    <div className='ml-auto'>
                                        <span className='text-xs text-white bg-blue-500 px-2 py-1 rounded-full'>Selected</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-500'>{provider.description}</p>
                            <div className='mt-4'>
                                {provider.config.map((config) => (
                                    <div key={config.name} className='mt-2'>
                                        <p className='text-sm font-medium flex justify-between'>
                                            {config.name}

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{config.desc}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                        </p>
                                        {config.isBuildable ? (
                                            <p className='text-sm text-green-600'>Buildable Configuration</p>
                                        ) : (
                                            <Select
                                                onValueChange={(value) =>
                                                    setSelectedValues((prev) => ({ ...prev, [config.name]: value }))
                                                }
                                                value={selectedValues[config.name] || ''}
                                            >
                                                <SelectTrigger>{selectedValues[config.name] || 'Select an option'}</SelectTrigger>
                                                <SelectContent>
                                                    {config.values.map((option) => (
                                                        <SelectItem key={option.uri} value={option.uri}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
