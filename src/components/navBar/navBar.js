import React, { useState } from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './styleNavBar.css';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    const [menuItems] = useState([
        {
            label: 'Afiliados',
            icon: 'pi pi-users',
            route: '/afiliados' // Aquí define la ruta correspondiente
        },
        {
            label: 'Disciplinas',
            icon: 'pi pi-star',
            route: '/disciplinas'
        },
        {
            label: 'Eventos',
            icon: 'pi pi-calendar',
            route: '/eventos'
        },
        {
            label: 'Resultados',
            icon: 'pi pi-trophy',
            route: '/resultados'
        }
    ]);

   

    return (
        <div className="navbar-container">
            <div className="navbar-header">
                <img src="/logo.png" alt="ClubDeportivoLogo" className="navbar-logo" />
            </div>
            <div className="navbar-icons-container">
                {menuItems.map((item, index) => (
                    <NavLink to={item.route} key={index} className="navbar-icon">
                        <Button icon={item.icon} label={item.label} rounded outlined aria-label="Filter" />
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

