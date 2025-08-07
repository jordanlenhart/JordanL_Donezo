import { Link, Outlet, useNavigate } from 'react-router-dom';
import supabase from '../client';

export default function MainLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    return (

        <>
            <div className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex items-center space-x-2">
                    <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
                        Donezo
                    </Link>
                </div>

                {/* Right: Logout */}
                <div>
                    <ul className="flex items-center space-x-4">
                        <li>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition hover:underline"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <Outlet />
        </>
    )
}