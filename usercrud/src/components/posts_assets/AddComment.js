import React, { useEffect, useState } from 'react'
import Button from './Button'

export default function AddComment(props) {
    const [userComment, setUserComment] = useState('')

    useEffect(() => {
        setUserComment("")
    }, [props.addedCommentToken])

    return (
        <>
            <div className="card-body p-2">
                <p>Leave Comment</p>
                <input type="text" value={userComment} placeholder='Comment' style={{ borderRadius: "6px" }} onChange={(e) => { setUserComment(e.target.value) }} />
                <Button onClick={() => props.postcomment(userComment)} />
            </div>
        </>
    )
}
