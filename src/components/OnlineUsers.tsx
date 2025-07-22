import React from "react";

interface OnlineUserProps {
    users : string[];
    currentUser : string;
}


const OnlineUsers: React.FC<OnlineUserProps> = ({users, currentUser}) => {
    // console.log("Online User:", users)
    return(
        <div className="bg-gray-100 p-4 rounded-lg mt-5">
            <h2 className="text-lg font-semibold mb-2 text-black">Users</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index} className={user === currentUser ? 'font-bold text-black': 'text-black'}>
                        {user} {user === currentUser && '(me)'}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OnlineUsers;