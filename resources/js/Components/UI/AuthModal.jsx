import { router } from '@inertiajs/react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordStatus, setForgotPasswordStatus] = useState(null);

    // Validación en tiempo real
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email)) {
            return 'Ingresa un correo válido (ejemplo@dominio.com)';
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validación en tiempo real para email
        if (name === 'email') {
            const emailError = validateEmail(value);
            setErrors((prev) => ({
                ...prev,
                email: emailError ? [emailError] : null,
            }));
        } else if (errors[name]) {
            // Limpiar error cuando el usuario escribe
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            route('password.email'),
            {
                email: forgotPasswordEmail,
            },
            {
                onSuccess: () => {
                    setForgotPasswordStatus(
                        'Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico.',
                    );
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Validación de email antes de enviar
        const emailError = validateEmail(formData.email);
        if (emailError) {
            setErrors({ email: [emailError] });
            setIsSubmitting(false);
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: ['Las contraseñas no coinciden'] });
            setIsSubmitting(false);
            return;
        }

        const url = isLogin ? route('login') : route('register');
        const data = isLogin
            ? {
                  email: formData.email,
                  password: formData.password,
                  // ⚠️ Elimina esta línea: _token ya lo maneja Inertia
              }
            : {
                  name: formData.name,
                  email: formData.email,
                  password: formData.password,
                  password_confirmation: formData.confirmPassword,
                  // ⚠️ Elimina esta línea: _token ya lo maneja Inertia
              };

        router.post(url, data, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                onSuccess?.();
                onClose();
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
            },
            onError: (err) => {
                let processedErrors = { ...err };

                if (err.email) {
                    if (err.email.includes('valid email')) {
                        processedErrors.email = [
                            'Ingresa un correo válido (ejemplo@dominio.com)',
                        ];
                    } else if (err.email.includes('match')) {
                        processedErrors.password = ['Contraseña incorrecta'];
                    } else if (err.email.includes('taken')) {
                        processedErrors.email = [
                            'Este correo ya está registrado',
                        ];
                    }
                }

                if (err.password) {
                    if (err.password.includes('incorrect')) {
                        processedErrors.password = ['Contraseña incorrecta'];
                    } else if (err.password.includes('characters')) {
                        processedErrors.password = [
                            'La contraseña debe tener al menos 8 caracteres',
                        ];
                    }
                }

                setErrors(processedErrors);
            },
        });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setShowForgotPassword(false);
    };

    if (!isOpen) return null;

    if (showForgotPassword) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div
                    className="relative w-full max-w-sm transform rounded-2xl bg-white shadow-2xl transition-all sm:max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setShowForgotPassword(false)}
                        className="absolute right-4 top-4 p-2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="p-8">
                        <div className="mb-6 text-center">
                            <h2 className="mb-1 text-3xl font-bold text-black">
                                Recuperar contraseña
                            </h2>
                            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600" />
                        </div>

                        {forgotPasswordStatus ? (
                            <div className="mb-4 rounded bg-green-100 px-4 py-2 text-sm text-green-700">
                                {forgotPasswordStatus}
                            </div>
                        ) : (
                            <>
                                <p className="mb-4 text-sm text-gray-600">
                                    Ingresa tu correo electrónico y te
                                    enviaremos un enlace para restablecer tu
                                    contraseña.
                                </p>

                                <form
                                    onSubmit={handleForgotPassword}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="forgotEmail"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            id="forgotEmail"
                                            value={forgotPasswordEmail}
                                            onChange={(e) =>
                                                setForgotPasswordEmail(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder="tu@email.com"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email[0]}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-3 font-semibold text-black transition-all duration-200 ${
                                            isSubmitting
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'hover:scale-[1.02] hover:from-yellow-500 hover:to-yellow-700 active:scale-[0.98]'
                                        }`}
                                    >
                                        {isSubmitting
                                            ? 'Enviando...'
                                            : 'Enviar enlace'}
                                    </button>
                                </form>
                            </>
                        )}

                        <div className="mt-4 text-center text-sm text-gray-600">
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="font-semibold text-yellow-600 hover:text-yellow-700 hover:underline"
                            >
                                Volver a{' '}
                                {isLogin ? 'iniciar sesión' : 'registrarse'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm transform rounded-2xl bg-white shadow-2xl transition-all sm:max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-400 transition-colors hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <h2 className="mb-1 text-3xl font-bold text-black">
                            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                        </h2>
                        <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600" />
                    </div>

                    {errors.general && (
                        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                    placeholder="Tu nombre completo"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="ejemplo@dominio.com"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password[0]}
                                </p>
                            )}
                            {isLogin && (
                                <div className="mt-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowForgotPassword(true)
                                        }
                                        className="text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-black placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.confirmPassword[0]}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-3 font-semibold text-black transition-all duration-200 ${
                                isSubmitting
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'hover:scale-[1.02] hover:from-yellow-500 hover:to-yellow-700 active:scale-[0.98]'
                            }`}
                        >
                            {isSubmitting
                                ? isLogin
                                    ? 'Iniciando...'
                                    : 'Registrando...'
                                : isLogin
                                  ? 'Iniciar sesión'
                                  : 'Registrarse'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {isLogin
                            ? '¿No tienes una cuenta? '
                            : '¿Ya tienes una cuenta? '}
                        <button
                            onClick={toggleMode}
                            className="font-semibold text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                            {isLogin ? 'Regístrate' : 'Inicia sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
