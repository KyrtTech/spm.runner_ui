"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button.tsx'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { type Strategy } from '@/sdk'
import { default as FileTreeDisplay, TreeNode } from '@/components/FileTreeComponent';
import DownloadLink from './DownloadLink';
import { useWizardStore } from '@/store/wizardStore'

export default function InstallationPlanDisplay() {
  const [data, setData] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedStates, setExpandedStates] = useState<boolean[]>([])
  const { sdk } = useWizardStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStrategies = async () => {
      if (!sdk) {
        return;
      }

      try {
        const strategies: Strategy[] = await sdk.getInstallPlan()
        setData(strategies)
        setExpandedStates(new Array(strategies.length).fill(false))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [sdk])

  const handleParameterChange = (strategyIndex: number, paramIndex: number, value: string) => {
    const newData = [...data]
    if (newData[strategyIndex].optionalParams[paramIndex]) {
      newData[strategyIndex].optionalParams[paramIndex].name = value
    }
    setData(newData)
  }

  const toggleExpanded = (index: number) => {
    const newExpandedStates = [...expandedStates]
    newExpandedStates[index] = !newExpandedStates[index]
    setExpandedStates(newExpandedStates)
  }

  const handleNext = async () => {
    if (!sdk) {
      return;
    }

    await sdk.startPlan();
    navigate('/evaluate-env-vars')
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return <div>Loading strategies...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const buildFileTree = (files: { localPath: string; accessUrl: string }[]): TreeNode[] => {
    const root: TreeNode = { name: 'root', type: 'folder', children: [] };

    files.forEach(file => {
      const parts = file.localPath.split('/');
      let currentNode = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // This is a file
          currentNode.children?.push({
            name: part,
            type: 'file',
            url: file.accessUrl
          });
        } else {
          // This is a folder
          let child = currentNode.children?.find(c => c.name === part && c.type === 'folder');
          if (!child) {
            child = { name: part, type: 'folder', children: [] };
            currentNode.children?.push(child);
            currentNode.children?.sort((a, b) => a.type.localeCompare(b.type));
          }
          currentNode = child;
        }
      });
    });

    return root.children || [];
  };

  return (
    <Card className="container mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Installation Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p>No strategies found.</p>
        ) : (<>
          {data.map((strategy, strategyIndex) => (
            <Collapsible
              key={strategyIndex}
              className="mb-4"
              open={expandedStates[strategyIndex]}
              onOpenChange={() => toggleExpanded(strategyIndex)}
            >
              <Card>
                <CardHeader>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <CardTitle>{strategy.title}</CardTitle>
                    {expandedStates[strategyIndex] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <p className="mb-2">{strategy.description}</p>
                    <p className="mb-2"><strong>URI:</strong> {strategy.uri}</p>

                    <h3 className="font-semibold mt-4 mb-2">Install Scripts:</h3>
                    <ul className="list-disc pl-5 mb-2">
                      {strategy.scripts.map((script, index) => (
                        <li key={index}><DownloadLink url={script} /></li>
                      ))}
                    </ul>

                    {strategy.uninstallScripts && (
                      <>
                        <h3 className="font-semibold mt-4 mb-2">Uninstall Scripts:</h3>
                        <ul className="list-disc pl-5 mb-2">
                          {strategy.uninstallScripts.map((script, index) => (
                            <li key={index}><DownloadLink url={script} /></li>
                          ))}
                        </ul>
                      </>
                    )}

                    <h3 className="font-semibold mt-4 mb-2">Support Files:</h3>

                    {strategy.supportFiles.length > 0 ? (
                      <FileTreeDisplay folderStructure={buildFileTree(strategy.supportFiles)} openFirstLevel={true} />
                    ) : (
                      <p>No support files available.</p>
                    )}

                    {strategy.downloadURL && (
                      <div className="flex items-center space-x-2 mb-2">
                        <strong>Download URL:</strong>
                        <DownloadLink url={strategy.downloadURL} />
                      </div>
                    )}

                    <h3 className="font-semibold mt-4 mb-2">Optional Parameters:</h3>
                    {strategy.optionalParams.length > 0 ? (
                      strategy.optionalParams.map((param, paramIndex) => (
                        <div key={paramIndex} className="mb-4">
                          <Label htmlFor={`param-${strategyIndex}-${paramIndex}`} className="block mb-1">
                            {param.name}
                          </Label>
                          <Input
                            type="text"
                            id={`param-${strategyIndex}-${paramIndex}`}
                            value={param.name}
                            onChange={(e) => handleParameterChange(strategyIndex, paramIndex, e.target.value)}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                        </div>
                      ))
                    ) : (
                      <p>No optional parameters</p>
                    )}

                    <h3 className="font-semibold mt-4 mb-2">Requirement Parameters:</h3>
                    {strategy.requirementParams.length > 0 ? (
                      <ul className="list-disc pl-5 mb-2">
                        {strategy.requirementParams.map((param, index) => (
                          <li key={index}>
                            <strong>{param.type?.split('/').pop()}</strong>
                            <br />
                            <div className="flex items-center space-x-4">
                              <RadioGroup
                                defaultValue={param.recommendedValue}
                                name={`param-${strategyIndex}-${index}`}
                                onValueChange={(value) => {
                                  const newData = [...data];
                                  // Fix the type error by using a type assertion or updating the type
                                  // @ts-ignore - Adding selectedValue property dynamically
                                  newData[strategyIndex].requirementParams[index].selectedValue = value;
                                  setData(newData);
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={param.minValue || ''} id={`min-${strategyIndex}-${index}`} />
                                  <Label htmlFor={`min-${strategyIndex}-${index}`}>Minimum: {param.minValue}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={param.recommendedValue || ''} id={`recommended-${strategyIndex}-${index}`} />
                                  <Label htmlFor={`recommended-${strategyIndex}-${index}`}>Recommended: {param.recommendedValue}</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <br />
                            SPM Param: {param.spmParam}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No requirement parameters</p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <div className="mt-6 flex justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </>
        )}
      </CardContent>
    </Card>
  )
}