import React from 'react';
import { Link } from 'react-router';

export const NavBar = () => {
  return (
    <>
      <Link className="hover:text-primary" to={'/news'}>
        news
      </Link>
      <Link className="hover:text-primary" to={'/top'}>
        top
      </Link>
      <Link className="hover:text-primary" to={'/submit'}>
        submit
      </Link>
    </>
  );
};
