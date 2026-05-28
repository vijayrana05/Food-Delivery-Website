import { useMemo, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { FiUploadCloud } from "react-icons/fi"
import { restaurantService } from "../main"

type AddMenuitemProps = {
  onCreated?: () => void
}

const AddMenuitem = ({ onCreated }: AddMenuitemProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || ""
    } catch {
      return ""
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    const numericPrice = Number(price)

    if (!trimmedName) return toast.error("Item name is required")
    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0)
      return toast.error("Valid price is required")
    if (!image) return toast.error("Item image is required")

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", trimmedName)
      formData.append("description", trimmedDescription)
      formData.append("price", String(numericPrice))
      formData.append("file", image)

      await axios.post(`${restaurantService}/api/items/new`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Menu item added")
      setName("")
      setDescription("")
      setPrice("")
      setImage(null)
      onCreated?.()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-center text-lg font-bold text-gray-900">
        Add Menu Item
      </h3>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 w-full max-w-md space-y-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E23744]"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E23744]"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="price ₹"
          inputMode="decimal"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#E23744]"
        />

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
          <FiUploadCloud className="h-5 w-5 text-[#E23744]" />
          <span className="flex-1 truncate">
            {image ? image.name : "Upload restaurant image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={
            "w-full rounded-xl bg-[#E23744] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d32f3a]" +
            (loading ? " cursor-not-allowed opacity-70" : "")
          }
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  )
}

export default AddMenuitem
