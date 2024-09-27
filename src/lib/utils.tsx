import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { FileArchive } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

// Function to return an appropriate Devicon class based on file extension
export const getFileIconClass = (filename: string) => {
  const extension = getFileExtension(filename);
  switch (extension) {
    case 'js':
      return <i className='devicon-javascript-plain colored' />; // JavaScript icon
    case 'ts':
      return <i className='devicon-typescript-plain colored' />; // TypeScript icon
    case 'json':
      return <i className='devicon-json-plain colored' />; // JSON icon (node.js)
    case 'html':
      return <i className='devicon-html5-plain colored' />; // HTML icon
    case 'css':
      return <i className='devicon-css3-plain colored' />; // CSS icon
    case 'java':
      return <i className='devicon-java-plain colored' />; // Java icon
    case 'py':
      return <i className='devicon-python-plain colored' />; // Python icon
    case 'php':
      return <i className='devicon-php-plain colored' />; // PHP icon
    case 'md':
      return <i className='devicon-markdown-plain colored' />; // Markdown icon
    case 'cs':
      return <i className='devicon-csharp-plain colored' />; // C# icon
    case 'tf':
      return <i className='devicon-terraform-plain colored' />; // Terraform icon
    case 'sh':
      return <i className='devicon-bash-plain colored' />; // Bash icon
    case 'zip':
    case 'tar':
      return <FileArchive className="h-4 w-4 text-yellow-500" />;
    default:
      return <i className='devicon-file-plain colored' />; // Default file icon
  }
};
