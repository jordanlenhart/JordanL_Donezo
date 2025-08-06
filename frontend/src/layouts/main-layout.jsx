import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';



export default function MainLayout(){

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error.message);
        } else {
          navigate('/login');
        }
      };    

    return (
        <>
          <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Donezo</Link>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li><button className="btn btn-link">Logout</button></li>
              </ul>
            </div>
          </div>
          <Outlet />
        </>
      )
}
