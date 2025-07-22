import { useForm, usePage } from '@inertiajs/react';
import { Edit, MoreVertical, Star, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthModal from './AuthModal';

export default function ReviewBox({ shopId, reviews: initialReviews }) {
    const page = usePage().props; // Cambiamos a desestructuración segura
    const auth = page?.auth || {};
    const flash = useMemo(() => page?.flash || {}, [page?.flash]);
    const [reviews, setReviews] = useState(initialReviews || []);
    const [editingId, setEditingId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const menuRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        shop_id: shopId,
        rating: 5,
        comment: '',
    });
    const {
        data: editData,
        setData: setEditData,
        put: editPut,
        processing: editProcessing,
        reset: resetEdit,
        errors: editErrors,
    } = useForm({
        rating: 5,
        comment: '',
    });

    const { delete: destroy} = useForm();

    console.log('Usuario auth:', auth.user);

    // Helpers
    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setEditData({
            rating: review.rating,
            comment: review.comment,
        });
        setOpenMenuId(null);
    };

    // Efecto para mostrar notificaciones flash
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]); // ← No depende de flash directamente

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!auth?.user || processing || !data.comment.trim()) return;

        post(route('ratings.store'), {
            preserveScroll: true,
            onSuccess: (response) => {
                reset(); // Limpia los campos del formulario
                if (response.newRating) {
                    setReviews((prev) => [...prev, response.newRating]);
                }
                toast.success('Reseña enviada correctamente');
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
                toast.error('Error al enviar la reseña');
            },
        });
    };

    const handleUpdate = (e, reviewId) => {
        e.preventDefault();
        if (editProcessing || !editData.comment.trim()) return;

        editPut(route('ratings.update', reviewId), {
            preserveScroll: true,
            onSuccess: (response) => {
                setEditingId(null);
                resetEdit();

                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === reviewId
                            ? {
                                  ...r,
                                  rating: editData.rating,
                                  comment: editData.comment,
                              }
                            : r,
                    ),
                );

                toast.success(
                    response.message || 'Reseña actualizada correctamente',
                );
            },
            onError: (errors) => {
                console.error('Errores al actualizar:', errors);
                toast.error('Error al actualizar la reseña');
            },
        });
    };

    const handleDelete = (reviewId) => {
        if (processing) return; // evita doble click

        destroy(route('ratings.destroy', reviewId), {
            preserveScroll: true,
            onSuccess: () => {
                setReviews((prev) => prev.filter((r) => r.id !== reviewId)); // quita de UI
                toast.success('Reseña eliminada correctamente');
            },
            onError: (errors) => {
                toast.error('Error al eliminar la reseña');
                console.error(errors);
            },
        });
    };

    const canModifyReview = (review) => {
        return (
            auth.user &&
            (auth.user.id === review.id_user || auth.user.role === 'admin')
        );
    };

    const handleTextareaClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    const toggleMenu = (reviewId, e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === reviewId ? null : reviewId);
    };

    return (
        <div className="mt-6 rounded-lg bg-white p-4 shadow-lg sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
                Reseñas{' '}
                {reviews.length > 0 && (
                    <span className="text-gray-600">({reviews.length})</span>
                )}
            </h3>

            {/* Formulario de reseña - Siempre visible */}
            <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex-shrink-0">
                        {auth.user ? (
                            <img
                                src={
                                    auth.user.profile_photo_path ||
                                    '/images/default-avatar.png'
                                }
                                alt={auth.user.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                <svg
                                    className="h-6 w-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        {auth.user && (
                            <div className="mb-3 sm:mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700 sm:mb-2">
                                    Tu calificación
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setData('rating', star)
                                            }
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-5 w-5 sm:h-6 sm:w-6 ${star <= data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            onClick={handleTextareaClick}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:p-4"
                            rows="4"
                            placeholder={
                                auth.user
                                    ? 'Escribe tu experiencia con esta chocolatería...'
                                    : 'Inicia sesión para escribir una reseña'
                            }
                            required
                            readOnly={!auth.user}
                        />
                    </div>
                </div>

                {auth.user && (
                    <div className="mt-3 flex justify-end sm:mt-4">
                        <button
                            type="submit"
                            disabled={processing || !data.comment.trim()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:px-6 sm:py-2 sm:text-base"
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg
                                        className="mr-2 h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : (
                                'Publicar reseña'
                            )}
                        </button>
                    </div>
                )}
            </form>

            {/* Modal de Autenticación */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            {/* Lista de reseñas existentes */}
            <div className="space-y-4 sm:space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex gap-3 sm:space-x-3">
                        <div className="flex-shrink-0">
                            {review.user.profile_photo_path ? (
                                <img
                                    src={review.user.profile_photo_path}
                                    alt={review.user.name}
                                    className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
                                    {getInitials(review.user.name)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 rounded-lg bg-gray-50 p-3">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-1">
                                    <span className="text-sm font-semibold text-gray-900 sm:text-base">
                                        {review.user.name}
                                    </span>
                                    <span className="hidden text-xs text-gray-500 sm:inline">
                                        •
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="hidden text-xs text-gray-500 sm:inline">
                                        •
                                    </span>
                                    <span className="text-xs text-gray-500 sm:text-sm">
                                        {formatDate(review.created_at)}
                                    </span>
                                </div>

                                {canModifyReview(review) && (
                                    <div
                                        className="relative self-end sm:self-auto"
                                        ref={menuRef}
                                    >
                                        <button
                                            onClick={(e) =>
                                                toggleMenu(review.id, e)
                                            }
                                            className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>

                                        {openMenuId === review.id && (
                                            <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(review)
                                                        }
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id,
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {editingId === review.id ? (
                                <form
                                    onSubmit={(e) => handleUpdate(e, review.id)}
                                    className="mt-2"
                                >
                                    <div className="mb-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setEditData(
                                                            'rating',
                                                            star,
                                                        )
                                                    }
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-5 w-5 ${
                                                            star <=
                                                            editData.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={editData.comment}
                                        onChange={(e) =>
                                            setEditData(
                                                'comment',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        rows="3"
                                        required
                                    />
                                    <div className="mt-2 flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={
                                                editProcessing ||
                                                !editData.comment.trim()
                                            }
                                            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="mt-1 text-sm text-gray-700 sm:text-base">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-500 sm:text-base">
                            No hay reseñas todavía. ¡Sé el primero en opinar!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
