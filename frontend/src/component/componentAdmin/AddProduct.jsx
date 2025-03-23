import React, { useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import {
  Box,
  MenuItem,
  Select,
  Typography,
  Chip,
  Input,
  ListItemText,
  Checkbox,
  FormHelperText,
  FormControl,
  TextField,
  InputAdornment,
  Button, InputLabel,
} from "@mui/material";

const AddProduct = () => {
  // Fetching data from the store
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const { flags } = useFlagStore();

  // Local state for selected category, subcategory, and child category
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [sizeChart, setSizeChart] = useState("");
  const [shippingReturn, setShippingReturn] = useState("");
  const [productCode, setProductCode] = useState("");
  const [rewardPoints, setRewardPoints] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredChildCategories, setFilteredChildCategories] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]); // Initialize as an array
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(""); // For storing the image URL
  const [imagePreview, setImagePreview] = useState(""); // For storing the image preview URL

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setThumbnailImage(file); // Store the file object (you'll upload this later)
      setImagePreview(imageUrl); // Set the preview URL
    }
  };
  // Remove image and reset preview
  const handleRemoveImage = () => {
    setThumbnailImage(null);
    setImagePreview("");
    document.getElementById("thumbnail-upload").value = ""; // Reset the input value
  };

  // Handle adding search tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput(""); // Clear input field
    }
  };

  // Handle removing search tags
  const handleDeleteTag = (tagToDelete) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToDelete));
  };

  // Local state for flags (selected flags)
  const [selectedFlags, setSelectedFlags] = useState([]);

  // Local state for form errors
  const [errors, setErrors] = useState({
    category: "",
  });

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory selection
    setSelectedChildCategory(""); // Reset child category selection

    if (!categoryId) {
      setFilteredSubCategories([]);
      return;
    }

    // Filter subcategories based on selected category ID
    const filteredSubs = subCategories.filter(
      (sub) => sub.category._id === categoryId,
    );
    setFilteredSubCategories(filteredSubs);
  };

  // Handle subcategory selection change
  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategory(subCategoryId);
    setSelectedChildCategory(""); // Reset child category selection

    if (!subCategoryId) {
      setFilteredChildCategories([]);
      return;
    }

    // Filter child categories based on selected subcategory ID
    const filteredChilds = childCategories.filter(
      (child) => child.subCategory._id === subCategoryId,
    );
    setFilteredChildCategories(filteredChilds);
  };

  // Handle child category selection change
  const handleChildCategoryChange = (e) => {
    setSelectedChildCategory(e.target.value);
  };

  // Handle flag selection change
  const handleFlagChange = (e) => {
    const selected = e.target.value;
    setSelectedFlags(selected);
  };

  // Handle form submission and validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    let validationErrors = { category: "" };

    if (!selectedCategory) {
      validationErrors.category = "Category is required.";
    }

    setErrors(validationErrors);

    // If there's no error, submit the form
    if (!validationErrors.category) {
      console.log("Form submitted");
      // Perform your form submission logic here
    }
  };
  // Handle reward points change and validation
  const handleRewardPointsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setRewardPoints(value);
  };

  // Handle adding keywords
  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();
      if (!metaKeywords.includes(keywordInput.trim())) {
        setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput(""); // Clear input field
    }
  };

  // Handle removing keywords
  const handleDeleteKeyword = (keywordToDelete) => {
    setMetaKeywords(
      metaKeywords.filter((keyword) => keyword !== keywordToDelete),
    );
  };

  // Log selected category, subcategory, and child category
  // console.log(`Category: ${selectedCategory}`);
  // console.log(`Sub Category: ${selectedSubCategory}`);
  // console.log(`Child Category: ${selectedChildCategory}`);
  // console.log(`Selected Flags: ${selectedFlags}`);
  // console.log(`Name: ${name}`);
  // console.log(`Short Description: ${shortDesc}`);
  // console.log(`Long Description: ${longDesc}`);
  // console.log(`Size Chart: ${sizeChart}`);
  // console.log(`Shipping and Return: ${shippingReturn}`);
  // console.log(`Product Code: ${productCode}`);
  // console.log(`Reward Points: ${rewardPoints}`);
  // console.log(`Video URL: ${videoUrl}`);
  // console.log(`Meta Title: ${metaTitle}`);
  // console.log(`Meta Keywords: ${metaKeywords}`);
  // console.log(`Meta Description: ${metaDescription}`);
  console.log(`Search Tags: ${searchTags}`);
  console.log(`Thumbnail Image: ${thumbnailImage}`);

  return (
    <div className={"shadow rounded-lg p-3"}>
      <form onSubmit={handleSubmit}>
        <div className={"md:grid grid-cols-12 gap-8"}>
          <div className={"col-span-8"}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />

            {/* Short Description */}
            <TextField
              label="Short Description"
              fullWidth
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />

            {/* Long Description */}
            <TextField
              label="Full Description"
              fullWidth
              multiline
              rows={4}
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              margin="normal"
            />
            {/* Size Chart */}
            <TextField
              label="Size Chart"
              fullWidth
              multiline
              rows={4}
              value={sizeChart}
              onChange={(e) => setSizeChart(e.target.value)}
              margin="normal"
            />
            {/* Shipping and Return */}
            <TextField
              label="Shipping and Return"
              fullWidth
              multiline
              rows={4}
              value={shippingReturn}
              onChange={(e) => setShippingReturn(e.target.value)}
              margin="normal"
            />
            {/* Search Tag Input */}
            <Box mb={2}>
              <Box display="flex" flexDirection="column" gap={1} margin="normal">
                <TextField
                  label="Search Tags"
                  fullWidth
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: searchTags.length > 0 && (
                      <InputAdornment position="start">
                        {/* Display all the chips inside the text field */}
                        <Box gap={1}>
                          {searchTags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              onDelete={() => handleDeleteTag(tag)}
                              size="small"
                              style={{
                                margin: "2px",
                                backgroundColor: "#e0e0e0",
                              }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </div>
          <div className={"col-span-4"}>
            {/* Thumbnail Image Upload */}
            <Box mb={2}>
              <Typography>
                Product Thumbnail Image{" "}
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: "none", // Hide the default file input
                }}
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                style={{
                  display: "block",
                  height: "210px",
                  marginTop: "10px",
                  border: "2px solid #aaa",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  backgroundImage: imagePreview
                    ? `url(${imagePreview})`
                    : "none", // Use backgroundImage
                  backgroundColor: imagePreview ? "transparent" : "#f0f0f0", // Use backgroundColor
                  backgroundSize: "contain", // Changed to contain
                  backgroundRepeat: "no-repeat", // Prevent background from repeating
                  backgroundPosition: "center", // Center the image
                  color: imagePreview ? "transparent" : "#000",
                }}
              >
                {imagePreview ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      Image Selected
                    </Typography>
                    {/* Remove Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        zIndex: 10,
                      }}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Click to upload an image
                  </Typography>
                )}
              </label>
            </Box>
            {/* Reward Points */}
            <TextField
              label="Reward Points"
              type="number" // Make it a number input
              fullWidth
              value={rewardPoints}
              onChange={handleRewardPointsChange}
              margin="normal"
            />
            {/* Product Code */}
            <TextField
              label="Product Code"
              fullWidth
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              margin="normal"
            />
            {/* Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.category)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Category
                </InputLabel>

                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  displayEmpty
                  label="Select Category"
                  id="category-select"  // Added id to link with InputLabel
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
            </Box>


            {/* Subcategory Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.subCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="subcategory-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Sub Category
                </InputLabel>

                <Select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory}
                  label="Select Sub Category"  // Label used in Select
                  id="subcategory-select"  // Added id to link with InputLabel
                >
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((subCategory) => (
                      <MenuItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No subcategories available</MenuItem>
                  )}
                </Select>

                {errors.subCategory && (
                  <FormHelperText>{errors.subCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>


            {/* Child Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.childCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="child-category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Child Category
                </InputLabel>

                <Select
                  value={selectedChildCategory}
                  onChange={handleChildCategoryChange}
                  displayEmpty
                  label="Select Child Category"
                  id="child-category-select" // Added id to link with InputLabel
                  disabled={!selectedSubCategory} // Disabled until a subcategory is selected
                >
                  {filteredChildCategories.length > 0 ? (
                    filteredChildCategories.map((childCategory) => (
                      <MenuItem key={childCategory._id} value={childCategory._id}>
                        {childCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No child categories available</MenuItem>
                  )}
                </Select>

                {errors.childCategory && (
                  <FormHelperText>{errors.childCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Flag Selection - Dropdown with Multiple Choices */}
            <Box mb={2}>
              <Typography>Select Flags</Typography>
              <Select
                multiple
                fullWidth
                value={selectedFlags}
                onChange={handleFlagChange}
                input={<Input />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((flagId) => {
                      const flag = flags.find((f) => f._id === flagId);
                      return (
                        <Chip
                          key={flag._id}
                          label={flag.name}
                          style={{ margin: 2 }}
                        />
                      );
                    })}
                  </div>
                )}
              >
                {flags.map((flag) => (
                  <MenuItem key={flag._id} value={flag._id}>
                    <Checkbox checked={selectedFlags.indexOf(flag._id) > -1} />
                    <ListItemText primary={flag.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </div>
        </div>




        {/* Video URL */}
        <TextField
          label="Video URL"
          fullWidth
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          margin="normal"
        />
        {/* Meta Title */}
        <TextField
          label="Meta Title"
          fullWidth
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          margin="normal"
        />
        {/* Meta Keywords Input */}
        <Box mb={2}>
          <Box display="flex" flexDirection="column" gap={1} margin="normal">
            <TextField
              label="Met Keywords"
              fullWidth
              placeholder="Type a keyword and press Enter"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: metaKeywords.length > 0 && (
                  <InputAdornment position="start">
                    {/* Display all the chips inside the text field */}
                    <Box gap={1}>
                      {metaKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => handleDeleteKeyword(keyword)}
                          size="small"
                          style={{
                            margin: "2px",
                            backgroundColor: "#e0e0e0",
                          }}
                        />
                      ))}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        {/* Meta Description */}
        <TextField
          label="Meta Description"
          fullWidth
          multiline
          rows={4}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          margin="normal"
          InputProps={{
            style: { resize: "vertical", overflow: "auto" }, // This makes it resizable
          }}
        />


        {/* Submit Button */}
        <Box mb={2}>
          <button type="submit">Submit</button>
        </Box>
      </form>
    </div>
  );
};

export default AddProduct;
