import type { IRestaurant } from "../types/restaurantTypes";
import { BiMapPin } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";

type RestaurantProfileProps = {
    restaurant: IRestaurant;
    isSeller?: boolean;

    isEditing?: boolean;
    draftName?: string;
    draftDescription?: string;
    onChangeName?: (value: string) => void;
    onChangeDescription?: (value: string) => void;
    onEdit?: () => void;
    onCancelEdit?: () => void;
    onSaveEdit?: () => void;
    savingEdit?: boolean;

    onToggleOpen?: () => void;
    togglingOpen?: boolean;
};

const formatDate = (value: IRestaurant["createdAt"]) => {
    try {
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString();
    } catch {
        return "";
    }
};

const RestaurantProfile = ({
    restaurant,
    isSeller = false,

    isEditing = false,
    draftName,
    draftDescription,
    onChangeName,
    onChangeDescription,
    onEdit,
    onCancelEdit,
    onSaveEdit,
    savingEdit = false,

    onToggleOpen,
    togglingOpen = false,
}: RestaurantProfileProps) => {
    const statusLabel = restaurant.isOpen ? "OPEN" : "CLOSED";
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-48 w-full object-cover"
                />

                {isSeller && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-gray-700 shadow hover:bg-white"
                        aria-label="Edit restaurant"
                    >
                        <FiEdit2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        {!isEditing ? (
                            <h2 className="truncate text-lg font-bold text-gray-900">{restaurant.name}</h2>
                        ) : (
                            <input
                                value={draftName ?? restaurant.name}
                                onChange={(e) => onChangeName?.(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-[#E23744]"
                            />
                        )}

                        <div className="mt-1 flex items-start gap-2 text-sm text-gray-600">
                            <BiMapPin className="mt-0.5 h-4 w-4 text-[#E23744]" />
                            <p className="line-clamp-2">
                                {restaurant.autolocation?.formattedAddress || "Address not available"}
                            </p>
                        </div>
                    </div>
                </div>

                {!isEditing ? (
                    restaurant.description && (
                        <p className="text-sm text-gray-700">{restaurant.description}</p>
                    )
                ) : (
                    <textarea
                        value={draftDescription ?? restaurant.description}
                        onChange={(e) => onChangeDescription?.(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#E23744]"
                    />
                )}

                <div className="flex items-center justify-between border-t pt-3">
                    <div className="text-sm font-semibold">
                        <span className={restaurant.isOpen ? "text-green-600" : "text-red-500"}>
                            {statusLabel}
                        </span>
                    </div>

                    {isSeller && (
                        <div className="flex items-center gap-2">
                            {isEditing && (
                                <>
                                    <button
                                        type="button"
                                        onClick={onCancelEdit}
                                        disabled={savingEdit}
                                        className={
                                            "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50" +
                                            (savingEdit ? " cursor-not-allowed opacity-60" : "")
                                        }
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSaveEdit}
                                        disabled={savingEdit || !onSaveEdit}
                                        className={
                                            "rounded-lg bg-[#E23744] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#d32f3a]" +
                                            (savingEdit || !onSaveEdit ? " cursor-not-allowed opacity-60" : "")
                                        }
                                    >
                                        {savingEdit ? "Saving..." : "Save"}
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={onToggleOpen}
                                disabled={togglingOpen || !onToggleOpen}
                                className={
                                    "rounded-lg px-4 py-2 text-sm font-semibold text-white transition " +
                                    (restaurant.isOpen
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-green-600 hover:bg-green-700") +
                                    (togglingOpen || !onToggleOpen ? " cursor-not-allowed opacity-60" : "")
                                }
                            >
                                {togglingOpen
                                    ? "Updating..."
                                    : restaurant.isOpen
                                        ? "Close Restaurant"
                                        : "Open Restaurant"}
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-400">Created on {formatDate(restaurant.createdAt)}</p>
            </div>
        </div>
    );
};

export default RestaurantProfile;
