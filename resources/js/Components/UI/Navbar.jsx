'use client';

import logo from '@/assets/logo_guia_cacao.png';
import { Link } from '@inertiajs/react';
import { ChevronDown, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AuthModal from './AuthModal';

export default function Navbar({ auth = { user: null } }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Cerrar menús al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                event.target.closest('button')?.ariaLabel !== 'Abrir menú'
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const closeAllMenus = () => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
        setUserMenuOpen(false);
    };

    const MobileMenuIcon = ({ isOpen }) => (
        <div className="relative h-6 w-6">
            {isOpen ? (
                <X className="absolute inset-0 h-6 w-6 text-[#713921] transition-all duration-300 ease-in-out" />
            ) : (
                <>
                    <span className="absolute left-0 top-1/3 h-0.5 w-full bg-[#713921] transition-all duration-300 ease-in-out" />
                    <span className="absolute bottom-1/3 left-0 h-0.5 w-full bg-[#713921] transition-all duration-300 ease-in-out" />
                </>
            )}
        </div>
    );

    const user = auth?.user || null;

    return (
        <header className="sticky top-0 z-50 w-full bg-[#e9d7ba] shadow-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-serif text-lg font-semibold text-[#713921]"
                >
                    <img
                        src={logo}
                        alt="Logo Chocolatería"
                        className="h-8 w-auto"
                    />
                    <span>GUÍA DEL CACAO</span>
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden items-center gap-8 lg:flex">
                    <Link
                        href="/inicio"
                        className="font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]"
                    >
                        Inicio
                    </Link>

                    {/* Dropdown Chocolaterías */}
                    <div
                        className="relative"
                        ref={dropdownRef}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1 font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]">
                            Chocolaterías
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-[#713921]/20 bg-[#e9d7ba] p-2 shadow-lg">
                                <Link
                                    href="/chocolaterias/destacadas"
                                    className="block rounded-lg px-4 py-2 font-serif text-sm text-[#713921] hover:text-[#e9b82f]"
                                >
                                    Destacadas
                                </Link>
                                <Link
                                    href="/chocolaterias/recomendadas"
                                    className="block rounded-lg px-4 py-2 font-serif text-sm text-[#713921] hover:text-[#e9b82f]"
                                >
                                    Recomendadas
                                </Link>
                                <Link
                                    href="/chocolaterias/clasicas"
                                    className="block rounded-lg px-4 py-2 font-serif text-sm text-[#713921] hover:text-[#e9b82f]"
                                >
                                    Clásicas
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/eventos"
                        className="font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]"
                    >
                        Eventos
                    </Link>
                    <Link
                        href="/recorridos"
                        className="font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]"
                    >
                        Recorridos Virtuales
                    </Link>
                    <Link
                        href="/noticias"
                        className="font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]"
                    >
                        Noticias
                    </Link>
                    <Link
                        href="/contacto"
                        className="font-serif text-sm font-medium text-[#713921] transition-colors hover:text-[#e9b82f]"
                    >
                        Contáctanos
                    </Link>
                </nav>

                {/* Desktop - Login o Avatar */}
                <div className="hidden items-center lg:flex">
                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9b82f] text-[#713921] focus:outline-none"
                                aria-label="Menú de usuario"
                            >
                                <User className="h-5 w-5" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#713921]/20 bg-[#e9d7ba] p-2 shadow-lg">
                                    <Link
                                        href="/perfil"
                                        className="block rounded-lg px-4 py-2 font-serif text-sm text-[#713921] hover:text-[#e9b82f]"
                                        onClick={closeAllMenus}
                                    >
                                        Configurar Perfil
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full rounded-lg px-4 py-2 text-left font-serif text-sm text-[#713921] hover:text-[#e9b82f]"
                                    >
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="rounded-xl bg-[#e9b82f] px-4 py-2 font-serif font-medium text-[#713921] shadow-md transition-all duration-200 hover:bg-[#e9b82f]/90"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                    {showAuthModal && (
                        <AuthModal
                            isOpen={showAuthModal} // ✅ esta línea es clave
                            onClose={() => setShowAuthModal(false)}
                        />
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 lg:hidden">
                    {user ? (
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9b82f] text-[#713921]"
                            aria-label="Menú de usuario"
                        >
                            <User className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="rounded-xl bg-[#e9b82f] px-4 py-2 font-serif text-sm font-medium text-[#713921] shadow-md hover:bg-[#e9b82f]/90"
                        >
                            Iniciar Sesión
                        </button>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 focus:outline-none"
                        aria-label="Abrir menú"
                    >
                        <MobileMenuIcon isOpen={false} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Ahora alineado a la izquierda */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-[#e9d7ba] p-6 lg:hidden"
                    ref={mobileMenuRef}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-serif text-lg font-semibold text-[#713921]"
                            onClick={closeAllMenus}
                        >
                            <img
                                src={logo}
                                alt="Logo Chocolatería"
                                className="h-8 w-auto"
                            />
                            <span>GUÍA DEL CACAO</span>
                        </Link>
                        <button
                            onClick={closeAllMenus}
                            className="p-2 focus:outline-none"
                            aria-label="Cerrar menú"
                        >
                            <X className="h-6 w-6 text-[#713921]" />
                        </button>
                    </div>

                    {/* Menú alineado a la izquierda */}
                    <nav className="flex flex-col gap-6 text-left">
                        <Link
                            href="/inicio"
                            onClick={closeAllMenus}
                            className="text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                        >
                            Inicio
                        </Link>

                        <div className="w-full">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex w-full items-center justify-between text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                            >
                                <span>Chocolaterías</span>
                                <ChevronDown
                                    className={`h-5 w-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {dropdownOpen && (
                                <div className="mt-3 flex flex-col gap-3 pl-4">
                                    <Link
                                        href="/chocolaterias/destacadas"
                                        onClick={closeAllMenus}
                                        className="text-lg text-[#713921] transition-colors hover:text-[#e9b82f]"
                                    >
                                        Destacadas
                                    </Link>
                                    <Link
                                        href="/chocolaterias/recomendadas"
                                        onClick={closeAllMenus}
                                        className="text-lg text-[#713921] transition-colors hover:text-[#e9b82f]"
                                    >
                                        Recomendadas
                                    </Link>
                                    <Link
                                        href="/chocolaterias/clasicas"
                                        onClick={closeAllMenus}
                                        className="text-lg text-[#713921] transition-colors hover:text-[#e9b82f]"
                                    >
                                        Clásicas
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/eventos"
                            onClick={closeAllMenus}
                            className="text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                        >
                            Eventos
                        </Link>
                        <Link
                            href="/recorridos"
                            onClick={closeAllMenus}
                            className="text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                        >
                            Recorridos Virtuales
                        </Link>
                        <Link
                            href="/noticias"
                            onClick={closeAllMenus}
                            className="text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                        >
                            Noticias
                        </Link>
                        <Link
                            href="/contacto"
                            onClick={closeAllMenus}
                            className="text-xl text-[#713921] transition-colors hover:text-[#e9b82f]"
                        >
                            Contáctanos
                        </Link>
                    </nav>
                </div>
            )}

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLoginSuccess={() => {
                        setShowAuthModal(false);
                        closeAllMenus();
                    }}
                />
            )}
        </header>
    );
}

function ChocolateIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#713921"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            <rect width="8" height="8" x="8" y="8" rx="1" />
        </svg>
    );
}
