/**
 * Generic button for Traveler's Tea
 *
 * @param text - text to go into button
 * @param onClick - what to do when clicked
 * @param className? - tailwind classnames to be added to the element
 * @return {JSX.Element}
 */
export function Button({text, onClick, className = ''}) {
    return (
        <button className={`rounded-md border-0 ${className}`} onClick={onClick}>{text}</button>
    )
}