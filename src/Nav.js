import React, { useEffect, useState } from 'react'
import './Nav.css'

function Nav() {

    const [show, handleShow] = useState(false);

    useEffect(()=>{
        window.addEventListener("scroll", ()=>
        {
            if(window.scrollY>100){
                handleShow(true);
            }else handleShow(false);
        });
        return () => {
            // window.removeEventListener("scroll");
        };
    },  []);
  return (
    <div className={`nav ${show && "nav_black"}`}>
        <img 
        className="nav_logo"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQeRoc_BhrP-jahuwf0Hrxe48LiP6DiHWiiw&s"
        alt="Netfix Logo"
        />
        <img 
        className="nav_avatar"
        src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
        alt="Netfix Logo"
        />
    </div>
  )
}

export default Nav
