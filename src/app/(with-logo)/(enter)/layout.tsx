export default function Authorization(
    {
        form,
        notice
    } : {
        form: React.ReactNode,
        notice: React.ReactNode
    }) {
    return (
        <div className="flex h-full flex-col justify-around">
            <div className="w-full flex justify-center content-center gap-16">
                {form}
                {notice}
            </div> 
        </div>
    );
}