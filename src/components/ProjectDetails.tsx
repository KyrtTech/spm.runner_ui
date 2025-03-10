import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from '@/store/wizardStore'
import { generateSKDWithEndpoint, startRunner } from "@/sdk";
import { useState } from 'react';

export function ProjectDetails() {
    const { setProjectDetails, projectName, environment, selectedInfraProvider, selectedService, setSDK } = useWizardStore()
    const navigate = useNavigate()
    const [isRunning, setIsRunning] = useState(false);

    const environments = ["development", "staging", "production"];

    const handleNext = async () => {
        if (projectName.trim() && environment) {

            //  start runner
            if (!selectedInfraProvider || !selectedService) {
                return
            }

            setIsRunning(true); // Start showing progress indicator
            const endpoint = await startRunner(selectedInfraProvider.name, selectedService.name);
            setSDK(generateSKDWithEndpoint(endpoint));
            setIsRunning(false); // Stop showing progress indicator

            navigate('/install-plan')
        }
    };

    return (
        <>
            <AlertDialog open={isRunning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Starting runner ...</AlertDialogTitle>
                        <AlertDialogDescription>
                            WAIT for IT
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>


            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                            id="projectName"
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectDetails(e.target.value, environment)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="environment">Environment</Label>
                        <Select value={environment} onValueChange={(value) => setProjectDetails(projectName, value)}>
                            <SelectTrigger id="environment">
                                <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                                {environments.map((env) => (
                                    <SelectItem key={env} value={env}>
                                        {env.charAt(0).toUpperCase() + env.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!projectName.trim() || !environment || isRunning}
                        >
                            {isRunning ? 'Starting...' : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}