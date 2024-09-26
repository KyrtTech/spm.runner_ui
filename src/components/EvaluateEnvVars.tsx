"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getPlanEnvVars, updateEnvVars, type EnvVar } from '@/sdk'

export default function EnvironmentVarsPage() {
  const [envVars, setEnvVars] = useState<EnvVar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const fetchedEnvVars = await getPlanEnvVars()
        setEnvVars(fetchedEnvVars)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEnvVars()
  }, [])

  if (loading) {
    return <div>Loading environment variables...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const handleValueChange = (index: number, newValue: string) => {
    const updatedEnvVars = [...envVars]
    updatedEnvVars[index].value = newValue
    setEnvVars(updatedEnvVars)
  }

  const handleNextClick = async () => {
    await updateEnvVars(envVars);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Configure Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {envVars.map((envVar, index) => (
            <div key={envVar.key} className="mb-4">
              <Label htmlFor={`env-${index}`} className="block mb-1">
                {envVar.key}
              </Label>
              <Input
                type="text"
                id={`env-${index}`}
                value={envVar.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <Button onClick={handleNextClick} className="w-full">
        🔄 Update Vars and 🚀 Start Plan
      </Button>
    </div>
  )
}