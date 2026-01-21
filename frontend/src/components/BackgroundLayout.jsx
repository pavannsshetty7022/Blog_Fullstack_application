const BackgroundLayout = ({ children }) => {
    return (
        <div className="min-vh-100 w-100 bg-white position-relative text-body">
            <div
                className="position-absolute top-0 start-0 w-100 h-100 pe-none"
                style={{
                    zIndex: 0,
                    backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
            repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
            repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
          `,
                }}
            />
            <div className="position-relative" style={{ zIndex: 10 }}>{children}</div>
        </div>
    );
};

export default BackgroundLayout;
