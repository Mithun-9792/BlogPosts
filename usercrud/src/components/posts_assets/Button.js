import React from 'react'

export default function Button({
    onClick,
    title = "Comment",
    style,
    className = "btn btn-secondary btn-sm m-2"
}) {
    return (
        <>
            <button className={className} onClick={onClick} type="submit" style={style}>{title}</button>
        </>
    )
}
