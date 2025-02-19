import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select';
import { useState } from 'react';
import { getInfraProviders } from '@/sdk';

export default function InfraProvidersList() {
  const { data, error, isLoading } = useQuery({ queryKey: ['infraProviders'], queryFn: getInfraProviders });
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  if (isLoading) return <p>Loading providers...</p>;
  if (error) return <p>Error loading providers.</p>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {data?.map((provider) => (
        <Card key={provider.name}>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Avatar>
                <img src={provider.logo} alt={provider.name} className='w-10 h-10 rounded-full' />
              </Avatar>
              <CardTitle>{provider.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500'>{provider.description}</p>
            <div className='mt-4'>
              {provider.config.map((config) => (
                <div key={config.name} className='mt-2'>
                  <p className='text-sm font-medium'>{config.name}</p>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
