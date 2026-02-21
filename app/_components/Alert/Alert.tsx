import React from 'react'
import './Alert.css';

type AlertType = 'success';

const Alert = ({
    type,
    text
}: {
    type: AlertType,
    text: string
}) => {
    const colorMap = new Map<string, string>([
        ['success', 'success-alert']
    ]);

    const colorClass = colorMap.get(type);
    console.log(colorClass)
    return (
        <div className={`floating-alert ${colorClass} slide-in`}>
            <p>{text}</p>
        </div>
    )
}

export default Alert