import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
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
    image: null // File object for new image
  });

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    
    if (response.data.success) {
      setList(response.data.data);
      console.log("These is Response : ", response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || '',
      discount: item.discount || 0,
      image: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEditForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      name: '',
      description: '',
      category: '',
      price: '',
      discount: 0,
      image: null
    });
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.description || !editForm.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append('id', editingItem._id);
    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('category', editForm.category);
    formData.append('price', editForm.price);
    formData.append('discount', editForm.discount);
    if (editForm.image) {
      formData.append('image', editForm.image);
    }
    // Append existing sizes as JSON to keep them unchanged
    formData.append('sizes', JSON.stringify(editingItem.sizes || []));

    try {
      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        handleCancelEdit();
      } else {
        toast.error(response.data.message || "Error updating food");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Server error while updating food");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  if (editingItem) {
    return (
      <div className='list add flex-col'>
        <p>Edit Food Item</p>
        <form onSubmit={handleUpdateFood} className='edit-form' encType="multipart/form-data">
          <div className='form-group'>
            <label>Name:</label>
            <input
              type='text'
              name='name'
              value={editForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Description:</label>
            <textarea
              name='description'
              value={editForm.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Category:</label>
            <input
              type='text'
              name='category'
              value={editForm.category}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Price:</label>
            <input
              type='number'
              name='price'
              value={editForm.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Discount (%):</label>
            <input
              type='number'
              name='discount'
              value={editForm.discount}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Image (optional, for update):</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
            />
            <p>Current image: {editingItem.image}</p>
          </div>
          {/* <div className='form-group'>
            <label>Sizes (view only):</label>
            <textarea
              value={JSON.stringify(editingItem.sizes, null, 2)}
              readOnly
              rows={4}
              cols={50}
            />
            <p>Note: Sizes are not editable here. Update via add form if needed.</p>
          </div> */}
          <div className='form-actions'>
            <button type='submit' className='btn-update'>Update Food</button>
            <button type='button' onClick={handleCancelEdit} className='btn-cancel'>Cancel</button>
          </div>
        </form>
        <button onClick={handleCancelEdit} className='back-to-list'>Back to List</button>
      </div>
    );
  }

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
            <div className="action-buttons">
  <button onClick={() => handleEdit(item)}>
    <p className="edit-btn">Edit</p>
  </button>
  <p className="cursor" onClick={() => removeFood(item._id)}>×</p>
</div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List