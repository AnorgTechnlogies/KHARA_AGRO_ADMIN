import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: 0,
    kg: '', // ✅ Added kg field to form
    image: null, // File object for new image
  });

  // Fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching products');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Server error while fetching products');
    }
  };

  // Start editing selected item
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || '',
      discount: item.discount || 0,
      kg: item.kg || '', // ✅ Pre-fill kg
      image: null,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEditForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      name: '',
      description: '',
      category: '',
      price: '',
      discount: 0,
      kg: '',
      image: null,
    });
  };

  // Update food item
  const handleUpdateFood = async (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.description || !editForm.price || !editForm.kg) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('id', editingItem._id);
    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('category', editForm.category);
    formData.append('price', editForm.price);
    formData.append('discount', editForm.discount);
    formData.append('kg', editForm.kg); // ✅ Added kg to form data

    if (editForm.image) {
      formData.append('image', editForm.image);
    }

    try {
      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        handleCancelEdit();
      } else {
        toast.error(response.data.message || 'Error updating food');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Server error while updating food');
    }
  };

  // Delete a food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error('Error removing product');
      }
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Server error while removing product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ============================
  // Edit Form UI
  // ============================
  if (editingItem) {
    return (
      <div className="list add flex-col">
        <p>Edit Food Item</p>
        <form onSubmit={handleUpdateFood} className="edit-form" encType="multipart/form-data">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={editForm.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={editForm.description} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <input type="text" name="category" value={editForm.category} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Price (₹):</label>
            <input type="number" name="price" value={editForm.price} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Weight (kg):</label>
            <input type="number" name="kg" value={editForm.kg} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Discount (%):</label>
            <input type="number" name="discount" value={editForm.discount} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Image (optional, for update):</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <p>Current image: {editingItem.image}</p>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-update">
              Update Food
            </button>
            <button type="button" onClick={handleCancelEdit} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
        <button onClick={handleCancelEdit} className="back-to-list">
          Back to List
        </button>
      </div>
    );
  }

  // ============================
  // Product List UI
  // ============================
  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Weight (kg)</b> {/* ✅ Added kg column */}
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/` + item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p>{item.kg} kg</p> {/* ✅ Show kg value */}
            <div className="action-buttons">
              <button onClick={() => handleEdit(item)}>
                <p className="edit-btn">Edit</p>
              </button>
              <p className="cursor" onClick={() => removeFood(item._id)}>
                ×
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
