import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CommentBox({ shopId }) {
    const { auth } = usePage().props;
    const [comment, setComment] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { post, processing } = useForm({
        comment: '',
        shop_id: shopId,
    });

    const handleFocus = () => {
        if (!auth.user) {
            router.visit(route('login'), {
                data: { intended: window.location.pathname }
            });
            return;
        }
        setIsFocused(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ratings.store'), {
            preserveScroll: true,
            onSuccess: () => setComment(''),
        });
    };

    return (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Deja tu reseña</h3>
            
            {auth.user ? (
                <form onSubmit={handleSubmit}>
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <img 
                                src={auth.user.profile_photo_path || '/images/default-avatar.png'}
                                alt={auth.user.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onFocus={handleFocus}
                                className="w-full rounded-lg border border-gray-300 p-4 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                rows="4"
                                placeholder="Escribe tu experiencia con esta chocolatería..."
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : 'Publicar reseña'}
                        </button>
                    </div>
                </form>
            ) : (
                <div 
                    onClick={handleFocus}
                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-gray-400"
                >
                    <p className="text-gray-600">
                        <span className="font-medium text-blue-600">Inicia sesión</span> para dejar tu reseña
                    </p>
                </div>
            )}
        </div>
    );
}
