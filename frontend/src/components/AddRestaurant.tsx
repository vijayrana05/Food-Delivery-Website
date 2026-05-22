import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../store/AppStore";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { restaurantService } from "../main";
import toast from "react-hot-toast";

type AddRestaurantProps = {
  onCreated?: () => void | Promise<void>;
};

const AddRestaurant = ({ onCreated }: AddRestaurantProps) => {
  const fetchLocation = useAppStore((state) => state.fetchLocation);
  const loadingLocation = useAppStore((state) => state.loadingLocation);
  const location = useAppStore((state) => state.location);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const formattedAddress = useMemo(() => {
    if (loadingLocation) return "Fetching your location...";
    if (!location?.formattedAddress) return "Location not available";
    return location.formattedAddress;
  }, [loadingLocation, location?.formattedAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload a restaurant image");
      return;
    }

    if (!location?.latitude || !location?.longitude || !location?.formattedAddress) {
      toast.error("Location not available yet. Please allow location and try again.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("phone", phone.trim());
      // backend expects `lattitude` (typo) not `latitude`
      formData.append("lattitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      formData.append("formattedAddress", location.formattedAddress);
      // multer expects field name `file`
      formData.append("file", image);

      const { data } = await axios.post(
        `${restaurantService}/api/restaurants/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data?.message || "Restaurant added successfully");

      setName("");
      setDescription("");
      setPhone("");
      setImage(null);

      await onCreated?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add restaurant";
      toast.error(message);
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4">
      <div className="mx-auto w-full max-w-sm space-y-6 pt-10">
        <h1 className="text-center text-2xl font-bold">Add Restaurant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Foody Biryani House"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#E23744]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Contact Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              inputMode="numeric"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#E23744]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your restaurant"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#E23744]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Restaurant Image</label>

            <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-4 text-gray-700 transition hover:border-[#E23744] hover:bg-red-50">
              <FiUploadCloud className="h-6 w-6 text-[#E23744]" />
              <div className="text-left">
                <p className="text-sm font-semibold">
                  {image ? "Change image" : "Upload image"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or WEBP (max size depends on your backend)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            {image && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Selected:</p>
                <p className="truncate text-sm font-medium text-gray-700">{image.name}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Detected Address</p>
            <p className="mt-1 text-sm text-gray-700">{formattedAddress}</p>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingLocation}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
              submitting || loadingLocation
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-[#E23744] text-white hover:bg-[#d32f3a]"
            }`}
          >
            {loadingLocation
              ? "Getting location..."
              : submitting
                ? "Submitting..."
                : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
