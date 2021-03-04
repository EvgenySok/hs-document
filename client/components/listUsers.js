import React from 'react'

const ListUsers = ({ users, currentUser }) => {
  const usersWithoutRepetitions = users.filter((user, id, arr) => arr.indexOf(user) === id)
  return (
    <div className="user__list">
      <h2>Users online</h2>
      <ul>
        {usersWithoutRepetitions.map(user => <li key={user}>{user} {user === currentUser ? '(me)' : ''}</li>)}
      </ul>
    </div>
  )
}

export default ListUsers
