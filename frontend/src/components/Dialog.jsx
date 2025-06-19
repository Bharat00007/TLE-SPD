export function Dialog({ open, onOpenChange, children }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-white/80 backdrop-blur-sm"
            onClick={onOpenChange}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[62%] max-h-[90vh] overflow-y-auto border border-blue-100 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                tabIndex={0}
            >
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children, className }) {
    return (
        <div className={`bg-white rounded-xl shadow p-4 ${className || ''}`}>
            {children}
        </div>
    );
}

export function DialogHeader({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children, className }) {
    return (
        <h2 className={`text-2xl font-bold text-blue-600 ${className || ''}`}>
            {children}
        </h2>
    );
}