"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button.tsx'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInstallPlan, startPlan, type Strategy } from '@/sdk.ts'

export default function InstallationPlanDisplay() {
  const [data, setData] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedStates, setExpandedStates] = useState<boolean[]>([])

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const strategies: Strategy[] = await getInstallPlan()  // Added type annotation
        setData(strategies)
        setExpandedStates(new Array(strategies.length).fill(false))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [])

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
    await startPlan();
    navigate('/evaluate-env-vars') // Replace '/next-page' with your desired route
  }

  if (loading) {
    return <div>Loading strategies...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Installation Strategies</h1>
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

                  <h3 className="font-semibold mt-4 mb-2">Scripts:</h3>
                  <ul className="list-disc pl-5 mb-2">
                    {strategy.scripts.map((script, index) => (
                      <li key={index}>{script}</li>
                    ))}
                  </ul>

                  {strategy.uninstallScripts && (
                    <>
                      <h3 className="font-semibold mt-4 mb-2">Uninstall Scripts:</h3>
                      <ul className="list-disc pl-5 mb-2">
                        {strategy.uninstallScripts.map((script, index) => (
                          <li key={index}>{script}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h3 className="font-semibold mt-4 mb-2">Support Files:</h3>
                  <ul className="list-disc pl-5 mb-2">
                    {strategy.supportFiles.map((file, index) => (
                      <li key={index}>{file.localPath} ({file.accessUrl})</li>
                    ))}
                  </ul>

                  {strategy.downloadURL && (
                    <p className="mb-2"><strong>Download URL:</strong> {strategy.downloadURL}</p>
                  )}

                  {strategy.runner && (
                    <p className="mb-2"><strong>Runner:</strong> {strategy.runner}</p>
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
                          <strong>{param.type}</strong>
                          <br />
                          Minimum: {param.minValue}, Recommended: {param.recommendedValue}
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

        <div className="mt-6">
          <Button
            onClick={handleNext}
            className="w-full"
          >
            Next
          </Button>
        </div>
      </>
      )}
    </div>
  )
}