export default function Button({className, children, ...props}) {
    if(className) {
        className = `${className} button`
    } else {
        className = "button"
    }
    
    return (
        <button className={className} {...props}>{children}</button>
    )
}