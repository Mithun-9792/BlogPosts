import React, { useState, useEffect } from 'react'
import Button from './Button'

export default function (props) {

    const [input, setInput] = useState('')

    useEffect(() => {
        setInput('')
    }, [props.addedCommentToken])

    return (
        <>
            <div className="card-body p-2">
                <p>Update Comment</p>
                <input type="text" value={input} placeholder='Comment' style={{ borderRadius: "6px" }} onChange={(e) => { setInput(e.target.value) }} />
                <Button onClick={() => { props.update_comments(input) }} title={"Update comment"} />
            </div>
        </>
    )
}
