import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Folder } from 'lucide-react'; // Import ChevronDown

// Define the structure types
export interface TreeNode {
    name: string;
    type: "file" | "folder";
    url?: string;
    children?: TreeNode[];
}

const getFileExtension = (filename: string) => {
    return filename.split('.').pop();
};

// Function to return an appropriate Devicon class based on file extension
const getFileIconClass = (filename: string) => {
    const extension = getFileExtension(filename);
    switch (extension) {
        case 'js':
            return 'devicon-javascript-plain'; // JavaScript icon
        case 'ts':
            return 'devicon-typescript-plain'; // TypeScript icon
        case 'json':
            return 'devicon-json-plain'; // JSON icon (node.js)
        case 'html':
            return 'devicon-html5-plain'; // HTML icon
        case 'css':
            return 'devicon-css3-plain'; // CSS icon
        case 'java':
            return 'devicon-java-plain'; // Java icon
        case 'py':
            return 'devicon-python-plain'; // Python icon
        case 'php':
            return 'devicon-php-plain'; // PHP icon
        case 'md':
            return 'devicon-markdown-plain'; // Markdown icon
        case 'cs':
            return 'devicon-csharp-plain'; // C# icon
        case 'tf':
            return 'devicon-terraform-plain'; // Terraform icon
        case 'sh':
            return 'devicon-bash-plain'; // Bash icon
        default:
            return 'devicon-file-plain'; // Default file icon
    }
};

// Function to return an appropriate color based on file extension
const getFileColor = (filename: string) => {
    const extension = getFileExtension(filename);
    switch (extension) {
        case 'js': return '#F7DF1E'; // JavaScript yellow
        case 'ts': return '#3178C6'; // TypeScript blue
        case 'json': return '#000000'; // JSON black
        case 'html': return '#E34F26'; // HTML orange
        case 'css': return '#1572B6'; // CSS blue
        case 'java': return '#007396'; // Java blue
        case 'py': return '#3776AB'; // Python blue
        case 'php': return '#777BB4'; // PHP purple
        case 'md': return '#083FA1'; // Markdown blue
        case 'cs': return '#239120'; // C# green
        case 'tf': return '#7B42BC'; // Terraform purple
        case 'sh': return '#4EAA25'; // Bash green
        default: return '#A9A9A9'; // Default gray
    }
};

// Recursive component to render the tree structure
const Tree: React.FC<{ nodes: TreeNode[]; level?: number }> = ({ nodes, level = 0 }) => {
    return (
        <div className={`${level > 0 ? 'ml-4' : ''}`}>
            {nodes.map((node, index) => (
                <div key={index}>
                    {node.type === "folder" ? (
                        <Accordion type="single" collapsible>
                            <AccordionItem value={node.name}>
                                <AccordionTrigger className="flex justify-between items-center py-2 w-full">
                                    <div className="flex items-center">
                                        <Folder className="h-4 w-4 mr-2" />
                                        <span className="font-semibold">{node.name}/</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {node.children && <Tree nodes={node.children} level={level + 1} />}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <i className={`devicon ${getFileIconClass(node.name)}`} style={{ color: getFileColor(node.name), fontSize: '1.2em' }}></i>
                            <span>{node.name}</span>
                            {node.url && (
                                <Button asChild variant="ghost" size="icon" className="h-4 w-4 p-0">
                                    <a
                                        href={node.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View original"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Main component to display the folder structure
const FileTreeDisplay: React.FC<{ folderStructure: TreeNode[] }> = ({ folderStructure }) => {
    return (
        <div className="container mx-auto">
            <Tree nodes={folderStructure} />
        </div>
    );
};

export default FileTreeDisplay;
