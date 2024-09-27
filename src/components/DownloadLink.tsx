import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileIconClass } from '@/lib/utils';

interface DownloadLinkProps {
    url: string;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({ url }) => {
    const filename = new URL(url).pathname.split('/').pop() || '';

    return (
        <span className="flex items-center space-x-1">
            {getFileIconClass(filename)}
            <span title={url} className="truncate max-w-xs">{filename}</span>
            <Button asChild variant="ghost" size="icon" className="h-4 w-4 p-0">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={url}
                >
                    <ExternalLink className="h-3 w-3" />
                </a>
            </Button>
        </span>
    );
};

export default DownloadLink;