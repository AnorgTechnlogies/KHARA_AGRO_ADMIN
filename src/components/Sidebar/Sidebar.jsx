import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="List Items" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
      </div>
      {/* Logout button at the bottom */}
      <div className="sidebar-logout">
        <NavLink to='/login' className="sidebar-option logout-option">
          {/* Add your logout icon here */}
          {/* <img src={assets.logout_icon || '/path/to/default-logout-icon.png'} alt="Logout" /> */}
          <p>Logout</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar