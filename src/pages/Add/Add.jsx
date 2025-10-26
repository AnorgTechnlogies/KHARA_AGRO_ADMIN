import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "rice",
    price: "",
    discount: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    if (!data.price) {
      toast.error("Please enter base price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          description: "",
          category: "Fertilizer",
          price: "",
          discount: "",
        });
        setImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding product. Please try again.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <input
            type="file"
            accept="image/*"
            id="image"
            hidden
            onChange={(e) => {
              setImage(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <label htmlFor="image" style={{ position: "relative", display: "block" }}>
            <img
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt="product"
            />
            {image && data.discount && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  backgroundColor: "#ff6b35",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  zIndex: 1,
                }}
              >
                {data.discount}% OFF
              </div>
            )}
          </label>
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            rows={6}
            placeholder="Write description here"
            required
          />
        </div>

        {/* Category */}
        <div className="add-category flex-col">
          <p>Product Category</p>
          <select
            name="category"
            onChange={onChangeHandler}
            value={data.category}
          >
            <option value="Rice">Rice</option>
            <option value="Pulses">Pulses</option>
            <option value="Poha">Poha</option>
            <option value="Seed">Seed</option>
            {/* <option value="Fertilizer">Fertilizer</option> */}
          </select>
        </div>

        {/* Base Price */}
        <div className="add-base-price flex-col">
          <p>Base Price (₹)</p>
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={data.price}
            placeholder="Enter base price"
            required
          />
        </div>

        {/* Discount */}
        <div className="add-discount flex-col">
          <p>Discount (%)</p>
          <input
            type="number"
            name="discount"
            onChange={onChangeHandler}
            value={data.discount}
            placeholder="e.g. 60"
          />
        </div>

        <button type="submit" className="add-btn">
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default Add;