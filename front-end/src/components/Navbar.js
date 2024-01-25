import { React, useState } from 'react';
import {Link} from 'react-router-dom';
import '../CSS/Navbar.css';
//import {Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink} from '../components/NavbarElement';
import styled from 'styled-components'
import { FaTimes, FaBars } from 'react-icons/fa'
import { useAuth } from './AuthContext';
//import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsopen] = useState(false);
    const toggleMenu = () => {
        setIsopen(!isOpen)
    };

    const { user } = useAuth();
    
    return (
        <Nav>
            <Logo href='/'>BudgetApp</Logo>
            <MenuLinks isOpen={isOpen} className='menulinks'>
                <MenuLink className='link'>
                    <Link to='/'  className='style'>Home</Link>
                </MenuLink>
                <MenuLink className='link'>
                    <Link to='/dashboard' className='style'>Dashboard</Link>
                </MenuLink>
                
                <MenuLink className='link'>
                    <Link to='/monthly-budget' className='style'>Budgets</Link>
                </MenuLink>

                <MenuLink className='link'>
                    <Link to='/create-monthly-budget' className='style'>Create</Link>
                </MenuLink>
                <MenuLink>
                    <Link to='/FAQ' className='style'>FAQ</Link>
                </MenuLink>

                {user == null ? (
                    <MenuLink>
                        <Link to='/sign-in' className='style'><Button>Sign In</Button></Link>
                    </MenuLink>
                ) : (
                    <MenuLink>
                        <Link to='/sign-out' className='style'><Button>Sign Out</Button></Link>
                    </MenuLink>
                )
                }
                
            </MenuLinks>
            <MenuToggle onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </MenuToggle>
        </Nav>
    )
};

const Nav = styled.nav`
background: #87ceeb;
color: #001f3f;
display: flex;
align-items: flex-start;
justify-content: space-between;
padding: 1rem 2rem;
`;

const Logo = styled.a`
color: #000;
font-weight: bold;
font-size: 1.5rem;
text-decoration: none;
&:hover {
    color: #fff;
}
`;

const MenuToggle = styled.div`
display: none;
cursor: pointer;

@media (max-width: 768px) {
    display: block;
}
`;

const MenuLinks = styled.div`
display: flex;
align-items: center;

@media (max-width: 768px) {
    flex-direction: column;
    width: 100px;
    max-width: 100%;
    max-height: ${({ isOpen }) => (isOpen ? '300px': '0')};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}
`;

const MenuLink = styled.div`
padding: 0.5rem 1rem;
cursor: pointer;

&:hover {
    color: #c82333;
}

@media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    &:hover {
        color: #999;
    }
}
`;

const Button = styled.button`
 background-color: #001f3f;
 color: #fff;
 border: none;
 padding: 0.35rem 0.75rem;
 font-size: 0.75rem;
 border-radius: 4px;
 cursor: pointer;

 &:hover {
    background-color: #000
 }
`;

/*
const Navbar = () => {
    const [isOpen, setIsopen] = useState(false);
    const toggleMenu = () => {
        setIsopen(isOpen);
    }
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
        <button 
            className={`navbar-toggler ${isOpen ? 'active' : ''}`}
            type='button'
            onClick={toggleMenu}
        >
            <span className='navbar-toggler-icon'></span>
        </button>
        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <a className='nav-link' href='#home'>
                        Home
                    </a>
                </li>
                <li className='nav-item'>
                    <a className='nav-link' href='#dashboard'>
                        Dashboard
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <nav className='navbar navbar-expand-lg navbar-dark bg-dark' style={{marginBottom: '100px'}}>
        <div className='container'>
            <a className='navbar-brand' href='/'>Logo</a>
            <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav'
            aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon'></span>
            </button>
        </div>
        <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav'>
                <li className='nav-item'>
                   <Link className='nav-link' to="/">Home</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to="/dashboard">Dashboard</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to="/sign-in">SignIn</Link>
                </li>
                <li className='nav-item'>
                    <Link className='nav-link' to="/sign-up">SignUp</Link>
                </li>
                <li>
                    <Link className='nav-link' to="/sign-out">SignOut</Link>
                </li>
            </ul>
        </div>
        
    </nav>
  );
};
*/
export default Navbar;