import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { getInfraProviders, getServices } from '@/sdk';
import { enrichInfraProvider, enrichService, ResolvedInfraProvider, ResolvedService } from '@/lib/enrich';
import { ServiceCard } from '@/components/ServiceCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWizardStore } from '@/store/wizardStore'

export default function InitialSelection() {
    const navigate = useNavigate();
    const { data: infraProvidersData, error: infraProvidersError, isLoading: infraProvidersIsLoading } = useQuery({ queryKey: ['infraProviders'], queryFn: getInfraProviders });
    const { data: servicesData, error: servicesError, isLoading: servicesIsLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
    const [infraProviders, setInfraProviders] = useState<ResolvedInfraProvider[]>();
    const { setInfraProvider, selectedInfraProvider, selectedService } = useWizardStore()
    const [services, setServices] = useState<ResolvedService[]>([]);

    useEffect(() => {
        if (!infraProvidersData) {
            return;
        }

        const enrich = async () => {
            const infraProviders = await Promise.all(infraProvidersData.map(enrichInfraProvider))
            setInfraProviders(infraProviders);
        };

        enrich();
    }, [infraProvidersData]);

    useEffect(() => {
        if (!servicesData) {
            return;
        }

        const enrich = async () => {
            const services = await Promise.all(servicesData.map(enrichService))
            setServices(services);
        }

        enrich();
    }, [servicesData]);

    if (infraProvidersIsLoading || servicesIsLoading || !infraProviders || !services) return <p>Loading providers and services...</p>;
    if (infraProvidersError || servicesError) return <p>Error loading providers and services.</p>;

    return (
        <div className='p-8'>
            <h1 className='text-2xl font-bold mb-4'>Infra Providers</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {infraProviders?.map((provider) => (
                    <Card key={provider.name} className={selectedInfraProvider?.name === provider.name ? 'border-2 border-blue-500' : ''}>
                        <CardHeader>
                            <div className='flex items-center gap-4'>
                                <Avatar>
                                    <img src={provider.logo} alt={provider.title} className='w-10 h-10 rounded-full' />
                                </Avatar>
                                <CardTitle>{provider.title}</CardTitle>
                                <div className='ml-auto flex items-center space-x-2'>
                                    <Switch id={provider.name} checked={selectedInfraProvider?.name === provider.name} onCheckedChange={() => setInfraProvider(provider)} />
                                    <Label htmlFor={provider.name} className='cursor-pointer'>Select</Label>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-500'>{provider.description}</p>
                            <div className='mt-4'>
                                {provider.config.map((config) => (
                                    <div key={config.name} className='mt-2'>
                                        <div className='text-sm font-medium flex justify-between'>
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

                                        </div>
                                        {config.isBuildable ? (
                                            <div className='text-sm text-green-600'>Buildable Configuration</div>
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
                                                        <SelectItem key={option.uri} value={option.name}>
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
            <h1 className='text-2xl font-bold mt-8 mb-4'>Services</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {services.map((service) => (
                    <ServiceCard
                        key={service.name}
                        service={service}
                    />
                ))}
            </div>
            <div className='mt-8 flex justify-end'>
                <Button 
                    onClick={() => navigate('/project-setup')}
                    disabled={!selectedInfraProvider || !selectedService}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
