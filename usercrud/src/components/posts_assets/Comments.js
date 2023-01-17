import React, { useEffect, useState } from 'react'
import Button from './Button'
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AddComment from './AddComment';
import UpdateComment from './UpdateComment';

const baseURL = "http://localhost:3030/"

export default function Comments(props) {
    const [comments, setComments] = useState([])
    const [userData, setUSerData] = useState()
    const [commentInput, setCommentInput] = useState(false);
    const [addedCommentToken, setAddedCommentToken] = useState()
    const [commentData, setCommentData] = useState('')
    const [commentId, setCommentID] = useState('')
    const token = localStorage.getItem("token")
    // console.log(props);

    useEffect(() => {

        loggedInData()
        get_comments()
    }, [addedCommentToken, props.addedCommentToken])

    const get_comments = async () => {
        await fetch(`${baseURL}comments/${props.postId}`)
            .then(data => data.json())
            .then((data) => {
                setComments(data)
                // console.log(data, "comment data");
            })
    }

    //Delete Comments
    const delete_comments = async (id) => {
        await fetch(`${baseURL}comments/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                return res.json()
            }
            ).then((data) => {
                if (data.affectedRows > 0) {
                    setComments(
                        comments.filter((comment) => {
                            return comment.id !== id
                        })
                    )
                } else {
                    // toast.warning("You're able to delete only that comments which are on your post!")
                }
            })
    }

    const loggedInData = async () => {
        await fetch(`${baseURL}me`, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${token}`
            },
        }).then(data => data.json())
            .then((data) => {
                setUSerData(data);
                // console.log(data, "LoggedIn userData");
            })
    }

    //get comment by comment id

    const getcomments = async (id) => {
        await fetch(`${baseURL}commentsbyid/${id}`)
            .then(data => data.json())
            .then((data) => {
                setCommentData(data)
                // console.log(data[0].comments);
            })
    }

    //Update Comment

    const update_comments = async (comment) => {
        // console.log(comment);
        await fetch(`${baseURL}comments/${commentData[0].id}`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    updatedcomment: comment
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                setAddedCommentToken(new Date().getTime().toString())
                setCommentID(0)
            })
    }

    return (
        <>
            <p className="card-text" >Comments:</p>
            {comments && comments.map((comment) => {
                return (
                    <>
                        <div className="d-inline-flex" key={comment.id}>
                            <p><b>{comment.user_name}</b> commented on post at {new Date(comment.commentAt).toDateString()} <br /> "{comment.comments}"</p>
                            {
                                (userData && (props.authorID === userData.id || comment.user_id === userData.id)) && (
                                    <div className="m-2">
                                        <Button className='btn btn-danger btn-sm m-1' onClick={() => { delete_comments(comment.id) }} title="Delete" />
                                    </div>
                                )
                            }
                            {
                                (userData && (comment.user_id === userData.id)) && (
                                    <div className="m-2">
                                        <Button className='btn btn-warning btn-sm m-1' onClick={() => {
                                            getcomments(comment.id)
                                            if (commentId !== comment.id) {
                                                setCommentID(comment.id)
                                            } else {
                                                setCommentID(0)
                                            }

                                            setCommentInput(!commentInput)
                                        }} title="Update" />
                                        {/* {(commentInput && comment.id) && ()} */}
                                        {(commentId === comment.id) && (<UpdateComment update_comments={(comment) => update_comments(comment)} addedCommentToken={addedCommentToken} />)}
                                    </div>
                                )
                            }
                        </div>
                        <hr className="mx-n10" />
                    </>
                )
            })}

        </>
    )
}
