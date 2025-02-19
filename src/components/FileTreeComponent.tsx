import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Folder } from 'lucide-react';
import { getFileIconClass } from '@/lib/utils';

// Define the structure types
export interface TreeNode {
    name: string;
    type: "file" | "folder";
    url?: string;
    children?: TreeNode[];
}

// Recursive component to render the tree structure
const Tree: React.FC<{ nodes: TreeNode[]; level?: number, opened?: boolean }> = ({ nodes, level = 0, opened = false }) => {
    return (
        <div className={`${level > 0 ? 'ml-4' : ''}`}>
            {nodes.map((node, index) => (
                <div key={index}>
                    {node.type === "folder" ? (
                        <Accordion type="single" collapsible defaultValue={opened ? node.name : undefined} className="border-none">
                            <AccordionItem value={node.name} className="border-none">
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
                            {getFileIconClass(node.name)}
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
const FileTreeDisplay: React.FC<{ folderStructure: TreeNode[], openFirstLevel?: boolean }> = ({ folderStructure, openFirstLevel = false }) => {
    return (
        <div className="container mx-auto">
            <Tree nodes={folderStructure} opened={openFirstLevel} />
        </div>
    );
};

export default FileTreeDisplay;
