'use client';

interface ToolProgressButtonProps {
  toolName: string;
  status: 'starting' | 'running' | 'completed' | 'error';
  message: string;
  isStreaming?: boolean;
}

export function ToolProgressButton({ toolName, status, message, isStreaming }: ToolProgressButtonProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'starting':
        return isStreaming ? (
          <span className="animate-spin text-blue-500">◐</span>
        ) : (
          <span className="text-blue-500">⚡</span>
        );
      case 'running':
        return isStreaming ? (
          <span className="animate-spin text-blue-500">◐</span>
        ) : (
          <span className="text-blue-500">◐</span>
        );
      case 'completed':
        return <span className="text-green-500">✓</span>;
      case 'error':
        return <span className="text-red-500">✗</span>;
      default:
        return <span className="text-slate-400">◯</span>;
    }
  };

  const getButtonStyle = () => {
    const baseClasses = "inline-flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 mb-2 shadow-sm border min-w-0 w-auto max-w-[80%] break-words";
    
    switch (status) {
      case 'starting':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800 ${isStreaming ? 'animate-pulse' : ''} shadow-md`;
      case 'running':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800 ${isStreaming ? 'animate-pulse' : ''} shadow-md`;
      case 'completed':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800 shadow-sm`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800 shadow-sm`;
      default:
        return `${baseClasses} bg-slate-50 border-slate-200 text-slate-700`;
    }
  };

  const getSkeletonContent = () => {
    if ((status === 'starting' || status === 'running') && isStreaming) {
      return (
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex items-center gap-3">
            <span>{toolName}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex items-center gap-2">
          <span>{toolName}</span>
          {message && status !== 'starting' && status !== 'completed' && (
            <span className="text-xs opacity-70 italic">— {message.replace(`${toolName}`, '').replace('...', '').trim()}</span>
          )}
          {status === 'completed' && (
            <span className="text-xs opacity-70">— Done</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={getButtonStyle()}>
      {getSkeletonContent()}
    </div>
  );
}