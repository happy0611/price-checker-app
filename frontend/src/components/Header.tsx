import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="ui menu">
            <div className="header item">Price Checker App</div>
            <a className="item" href="/">Home</a>
            <a className="item" href="/about">About</a>
            <a className="item" href="/contact">Contact</a>
        </header>
    );
};

export default Header;
