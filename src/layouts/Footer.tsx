
const Footer = ({ Pending = 0, Active = 0, InProgress = 0, Complete = 0 }: { Pending?: number; Active?: number; InProgress?: number; Complete?: number; }) => {
    const total = Pending + Active + InProgress + Complete;
    const parts: string[] = [];

    if (Pending > 0) parts.push(`😒 ${Pending} pending` + (Pending === 1 ? ' task' : ' tasks'));
    if (Active > 0) parts.push(`😃 ${Active} active` + (Active === 1 ? ' task' : ' tasks'));
    if (InProgress > 0) parts.push(`🚀 ${InProgress} in progress` + (InProgress === 1 ? ' task' : ' tasks'));
    if (Complete > 0) parts.push(`🎉 ${Complete} completed` + (Complete === 1 ? ' task' : ' tasks'));

    return (
        <div>
            {total > 0 ? (
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        {parts.join(", ")}
                        <br />
                        Keep up the good work! 💪
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">📝 You have no tasks at the moment. Time to relax!</div>
                </div>
            )}
        </div>
    );
};

export default Footer;