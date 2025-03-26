import React from 'react'
import '../css/Slidebar.css'
import { Link } from 'react-router-dom';
import Ownercard from './Ownercard'

import dashboard from '../images/dashboard.png'
import ingredient from '../images/ingredient.png'
import item from '../images/item.png'
import production from '../images/production.png'
import sales from '../images/sales.png'
import smartrebake from '../images/smart-rebake.png'
import report from '../images/report.png'


export default function Slidebar() {
  return (
    <div className="slidebar-container">
        <div className="ownercard">
            {<Ownercard/>}
        </div>
        <div className="nav-button-wrapper">

            <Link to="/" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={dashboard} alt="Dashboard" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Dashboard</div>
            </div>
            </Link>

            <Link to="/show-ingredient" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={ingredient} alt="ingre-image" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Ingredients</div>
            </div>
            </Link>

            <Link to="/items" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={item} alt="items-images" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Items</div>
            </div>
            </Link>

            <Link to="/production" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={production} alt="production-images" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Production</div>
            </div>
            </Link>

            <Link to="/create-sales" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={sales} alt="sales-images" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Sales</div>
            </div>
            </Link>

            <Link to="#" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={smartrebake} alt="smart-rebake-images" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Smart Rebake</div>
            </div>
            </Link>

            <Link to="/all-reports" className='nav-link'>
            <div className="nav-button-container">
                <div className="nav-button-image">
                   <img src={report} alt="Reports-image" className="nav-button-icon"/>
                </div>
                <div className="nav-button-text">Reports</div>
            </div>
            </Link>


        </div>
    </div>
   
  )
}
