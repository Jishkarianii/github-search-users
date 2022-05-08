import "./UserItem.css"

function UserItem({ img, userName, url }) {
    return (
        <div className="user-item">
            <div className="user-info">
                <img src={img} alt="photo" />
                <p>{userName}</p>
            </div>
            <a href={url} target="_blank">Jump to</a>
        </div>
    )
}

export default UserItem
