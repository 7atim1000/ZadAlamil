// Using JSON Approach instead of formData
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { getCategories } from '../../../../Utils/categoryService';

export function EditProductVendorModal({ open, setOpen, saveProduct, product }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    price: 0,
    originalPrice: 0,
    category: '',
    color: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories(1, 1000); 
        console.log("Categories API response:", data);

        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.warn("Unexpected API response structure:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error loading categories:", error.message);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open]);

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        stock: product.stock || 0,
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category?._id || product.category || '',
        color: product.color || '',
      });
    }
  }, [product, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'stock' || name === 'price' || name === 'originalPrice') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create clean JSON data (not FormData)
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        stock: Number(formData.stock),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        category: formData.category,
        color: formData.color.trim()
      };

      console.log("Submitting vendor product update:", submitData);

      // Validate required fields
      if (!submitData.name) {
        throw new Error("Product name is required");
      }
      if (!submitData.category) {
        throw new Error("Category is required");
      }
      if (isNaN(submitData.price) || submitData.price < 0) {
        throw new Error("Valid price is required");
      }
      if (isNaN(submitData.stock) || submitData.stock < 0) {
        throw new Error("Valid stock quantity is required");
      }

      await saveProduct(submitData);
    } catch (error) {
      console.error('Error in form submission:', error);
      throw error; // Re-throw to handle in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      stock: 0,
      price: 0,
      originalPrice: 0,
      category: '',
      color: '',
    });
    setOpen(false);
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.name && 
           formData.category && 
           !isNaN(formData.price) && 
           formData.price >= 0 && 
           !isNaN(formData.stock) && 
           formData.stock >= 0;
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.0, y: -100 },
      }}
      className='border-2 border-gray-300 max-h-[90vh] overflow-y-auto'
      size="lg"
    >
      <div className='p-6'>
        <DialogHeader>
          <div className="flex justify-between w-full items-center">
            <span className="text-xl font-bold">Edit Product</span>
            <Button
              variant="text"
              color="black"
              onClick={handleClose}
              className="p-0 text-sm"
            >
              X
            </Button>
          </div>
        </DialogHeader>
        
        <DialogBody>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <label className="text-lg font-medium mt-2">1. General Info</label>
            <div className ='flex flex-col gap-3'>
              <Input
                type="text"
                name="name"
                label="Product Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
                
              />
              <Textarea
                name="description"
                
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <label className="text-lg font-medium mt-2">2. Stocking</label>
            <Input
              type="number"
              name="stock"
              label="Stock Quantity *"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
            />

            <label className="text-lg font-medium mt-2">3. Pricing</label>
            <div className="space-y-3">
              <Input
                type="number"
                name="originalPrice"
                label="Original Price (AED)"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
              <Input
                type="number"
                name="price"
                label="Sale Price (AED) *"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <label className="text-lg font-medium mt-2">4. Category *</label>
            <Select
              name="category"
              label="Select Category"
              value={formData.category}
              onChange={(value) => handleSelectChange(value, 'category')}
              disabled={categoriesLoading}
            >
              <Option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </Option>
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>

            <label className="text-lg font-medium mt-2">5. Current Image</label>
            <div>
              {product?.productImg && (
                <div className="mb-2">
                  <img 
                    src={product.productImg} 
                    alt="Current product" 
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <p className="text-sm text-gray-600 mt-1">Current product image</p>
                  <p className="text-xs text-gray-500">
                    To change the image, please use the dedicated image update feature.
                  </p>
                </div>
              )}
            </div>

            <label className="text-lg font-medium mt-2">6. Color</label>
            <Input
              type="text"
              name="color"
              label="Color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="e.g., Red, Blue, Black"
            />
          </form>
        </DialogBody>

        <DialogFooter className='mt-5 flex justify-between'>
          <Button
            variant="outlined"
            color="red"
            onClick={handleClose}
            className="px-6 py-2"
            disabled={loading}
          >
            <span>CANCEL</span>
          </Button>
          <Button
            className='bg-green-900 text-white px-6 py-2 rounded-md'
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="spinner-border animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
                <span>UPDATING...</span>
              </div>
            ) : (
              <span>UPDATE PRODUCT</span>
            )}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

EditProductVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveProduct: PropTypes.func.isRequired,
  product: PropTypes.object,
};

//Using Form data 
// import { PropTypes } from 'prop-types';
// import { useState, useEffect } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Input,
//   Textarea,
//   Select,
//   Option,
// } from "@material-tailwind/react";
// import { getCategories } from '../../../../Utils/categoryService';

// export function EditProductVendorModal({ open, setOpen, saveProduct, product }) {
//   // Fetch categories when modal opens
//   useEffect(() => {
//     const loadCategories = async () => {
//       setLoading(true);
//       try {
//         const data = await getCategories(1, 1000); 
//         console.log("Categories API response:", data);

//         if (data && Array.isArray(data.categories)) {
//           setCategories(data.categories);
//         } else {
//           console.warn("Unexpected API response structure:", data);
//           setCategories([]);
//         }
//       } catch (error) {
//         console.error("Error loading categories:", error.message);
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open) {
//       loadCategories();
//     }
//   }, [open]);


//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     stock: '',
//     price: '',
//     originalPrice: '',
//     category: '',
//     color: '',
//     image: null
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Reset form when product changes or modal opens
//   useEffect(() => {
//     if (product && open) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         stock: product.stock?.toString() || '',
//         price: product.price?.toString() || '',
//         originalPrice: product.originalPrice?.toString() || '',
//         category: product.category?._id || product.category || '',
//         color: product.color || '',
//         image: null
//       });
//     }
//   }, [product, open]);

//   // Fetch categories (you'll need to implement this API)
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         // You'll need to create this API function
//         // const response = await getVendorCategories();
//         // if (response.success) {
//         //   setCategories(response.categories);
//         // }
        
//         // Temporary mock data - replace with actual API call
//         setCategories([
//           { _id: '1', name: 'Electronics' },
//           { _id: '2', name: 'Clothing' },
//           { _id: '3', name: 'Home & Garden' }
//         ]);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     if (open) {
//       fetchCategories();
//     }
//   }, [open]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       image: e.target.files[0]
//     }));
//   };

//   const handleSelectChange = (value, name) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Create FormData for file upload
//       const submitData = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'image' && formData[key]) {
//           submitData.append('image', formData[key]);
//         } else if (formData[key] !== null && formData[key] !== undefined) {
//           submitData.append(key, formData[key]);
//         }
//       });

//       await saveProduct(submitData);
//     } catch (error) {
//       console.error('Error in form submission:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       name: '',
//       description: '',
//       stock: '',
//       price: '',
//       originalPrice: '',
//       category: '',
//       color: '',
//       image: null
//     });
//     setOpen(false);
//   };

//   return (
//     <Dialog
//       open={open}
//       handler={handleClose}
//       animate={{
//         mount: { scale: 1, y: 0 },
//         unmount: { scale: 0.0, y: -100 },
//       }}
//       className='border-2 border-gray-300 max-h-[90vh] overflow-y-auto'
//       size="lg"
//     >
//       <div className='p-6 overflow-y-scroller'>
//         <DialogHeader>
//           <div className="flex justify-between w-full items-center">
//             <span className="text-xl font-bold">Edit Product</span>
//             <Button
//               variant="text"
//               color="black"
//               onClick={handleClose}
//               className="p-0 text-sm"
//             >
//               X
//             </Button>
//           </div>
//         </DialogHeader>
        
//         <DialogBody>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//             <label className="text-lg font-medium mt-2">1. General Info</label>
//             <div>
//               <Input
//                 type="text"
//                 name="name"
//                 label="Product Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="mb-3"
//               />
//               <Textarea
//                 name="description"
//                 label="Description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="3"
//               />
//             </div>

//             <label className="text-lg font-medium mt-2">2. Stocking</label>
//             <Input
//               type="number"
//               name="stock"
//               label="Stock Quantity"
//               value={formData.stock}
//               onChange={handleInputChange}
//               min="0"
//               required
//             />

//             <label className="text-lg font-medium mt-2">3. Pricing</label>
//             <div className="space-y-3">
//               <Input
//                 type="number"
//                 name="originalPrice"
//                 label="Original Price (AED)"
//                 value={formData.originalPrice}
//                 onChange={handleInputChange}
//                 min="0"
//                 step="0.01"
//               />
//               <Input
//                 type="number"
//                 name="price"
//                 label="Sale Price (AED)"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </div>

//             <label className="text-lg font-medium mt-2">4. Category</label>
//             <Select
//               name="category"
//               label="Select Category"
//               value={formData.category}
//               onChange={(value) => handleSelectChange(value, 'category')}
//             >
//               {categories.map(category => (
//                 <Option key={category._id} value={category._id}>
//                   {category.name}
//                 </Option>
//               ))}
//             </Select>

//             <label className="text-lg font-medium mt-2">5. Media</label>
//             <div>
//               {product?.productImg && (
//                 <div className="mb-2">
//                   <img 
//                     src={product.productImg} 
//                     alt="Current product" 
//                     className="w-20 h-20 object-cover rounded border"
//                   />
//                   <p className="text-sm text-gray-600">Current Image</p>
//                 </div>
//               )}
//               <Input
//                 type="file"
//                 name="image"
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 label="Upload New Image (optional)"
//               />
//             </div>

//             <label className="text-lg font-medium mt-2">6. Color</label>
//             <Input
//               type="text"
//               name="color"
//               label="Color"
//               value={formData.color}
//               onChange={handleInputChange}
//             />
//           </form>
//         </DialogBody>

//         <DialogFooter className='mt-5 flex justify-between'>
//           <Button
//             variant="outlined"
//             color="red"
//             onClick={handleClose}
//             className="px-6 py-2"
//           >
//             <span>CANCEL</span>
//           </Button>
//           <Button
//             className='bg-green-900 text-white px-6 py-2 rounded-md'
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             <span>{loading ? 'UPDATING...' : 'UPDATE'}</span>
//           </Button>
//         </DialogFooter>
//       </div>
//     </Dialog>
//   );
// }

// EditProductVendorModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   saveProduct: PropTypes.func.isRequired,
//   product: PropTypes.object,
// };