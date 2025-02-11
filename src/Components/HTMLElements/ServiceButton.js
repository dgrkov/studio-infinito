import './HTMLElements.css'

export default function ServiceButton ({ text, class_name, onClick }) {
    return (
        <button id='service_button' className={class_name} onClick={onClick}>
            <span className="button_top"> {text} </span>
        </button>
    )
}