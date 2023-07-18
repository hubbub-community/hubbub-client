import React from 'react'
import { useAuth0 } from '../../auth0-wrapper'

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  const lwr = () => loginWithRedirect()
  const lo = () => logout()

  return (
    <div>
      {!isAuthenticated && <button onClick={lwr}>Log in</button>}

      {isAuthenticated && <button onClick={lo}>Log out</button>}
    </div>
  )
}

export default NavBar
