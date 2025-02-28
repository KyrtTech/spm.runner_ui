import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from '@/store/wizardStore'

export function ProjectDetails() {
    const { setProjectDetails, projectName, environment } = useWizardStore()
    const navigate = useNavigate()

    const environments = ["development", "staging", "production"];

    const handleNext = () => {
        if (projectName.trim() && environment) {
            navigate('/install-plan')
        }
    };

    return (
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
                        onClick={() => navigate('/')}
                    >
                        Previous
                    </Button>
                    <Button 
                        onClick={handleNext}
                        disabled={!projectName.trim() || !environment}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}