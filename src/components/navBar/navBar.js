import React, { useState } from 'react';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import './styleNavBar.css';

export default function NavBar() {
    const [menuItems] = useState([
        {
            label: 'Afiliados',
            icon: 'pi pi-users',
            command: () => {}
        },
        {
            label: 'Disciplinas',
            icon: 'pi pi-star',
            command: () => {}
        },
        {
            label: 'Eventos',
            icon: 'pi pi-calendar',
            command: () => {}
        },
        {
            label: 'Resultados',
            icon: 'pi pi-trophy',
            command: () => {}
        }
    ]);

   

    return (
        <div className="navbar-container">
            <div className="navbar-header">
                <img src="/logo.png" alt="ClubDeportivoLogo" className="navbar-logo" />
            </div>
            <div className="navbar-icons-container">
                {menuItems.map((item, index) => (
                    <Button icon={item.icon} key={index}  label={item.label} rounded outlined aria-label="Filter"  className="navbar-icon"  />
                ))}
            </div>
        </div>
    );
}
