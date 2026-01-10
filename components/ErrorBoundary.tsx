import React, { Component, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the component tree
 * Displays a user-friendly fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#051024] flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-[#0f2445] rounded-3xl border border-red-500/30 p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-500/10 rounded-full">
                                <ShieldAlert className="w-16 h-16 text-red-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white font-prompt">
                                เกิดข้อผิดพลาด
                            </h1>
                            <p className="text-blue-200/70 text-sm">
                                Something went wrong
                            </p>
                        </div>

                        <div className="bg-[#051024] border border-blue-900/30 rounded-xl p-4">
                            <p className="text-xs text-red-400 font-mono break-words">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                        </div>

                        <button
                            onClick={this.handleReset}
                            className="w-full bg-[#0057B8] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5" />
                            รีเฟรชแอป (Reload App)
                        </button>

                        <p className="text-blue-200/50 text-xs">
                            หากปัญหายังคงอยู่ กรุณาติดต่อทีมพัฒนา
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
