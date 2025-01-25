import mongoose from 'mongoose'; 
import InventoryRouter from "../routes/inventoryRouter.js";
import MediInventory from "../models/MediInventory.js";

//Create item
const createItem = async (req, res) => {
    const { name, qty_in_stock, unit_price, dosage_form, brand_name, supplier_name, category, expiry_date,threshold } = req.body;

    try {
        // Check if the inventory item already exists (based on name)
        const existingItem = await MediInventory.findOne({ name });
        if (existingItem) {
            return res.status(400).json({ message: 'Item already exists in the inventory' });
        }

        // Ensure that the unit_price is a decimal with two decimal places
        const formattedUnitPrice = parseFloat(unit_price).toFixed(2); // Format to two decimal places
        const decimalUnitPrice = mongoose.Types.Decimal128.fromString(formattedUnitPrice); // Convert to Decimal128

        // Create a new inventory item
        const newInventoryItem = new MediInventory({
            name,
            qty_in_stock,
            unit_price: decimalUnitPrice, // Store as Decimal128
            dosage_form,
            brand_name,
            supplier_name,
            category,
            expiry_date,
            threshold,
        });

        // Save the new inventory item
        await newInventoryItem.save();

        // Return the response with the newly created item (excluding sensitive data like price if needed)
        res.status(201).json({
            message: 'Inventory item created successfully',
            item: {
                name: newInventoryItem.name,
                qty_in_stock: newInventoryItem.qty_in_stock,
                brand_name: newInventoryItem.brand_name,
                category: newInventoryItem.category,
                expiry_date: newInventoryItem.expiry_date,
                unit_price: formattedUnitPrice, // Include formatted price in the response
                threshold:newInventoryItem.threshold,
            } // Send relevant data in the response
        });
    } catch (error) {
        console.error("Error during Inventory Item Creation:", error);  // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message || error });
    }
};


//Get all items
const getAllItems= (req, res) => {
    // Fetch all items, excluding sensitive fields if needed (e.g., `supplier_name`, `unit_price`, etc.)
    MediInventory.find({})
        .then((items) => {
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "No items found." });
            }
            // res.status(200).json(items); // Send the list of items
            // Filter items where qty_in_stock > threshold

            //added a buffer to the stock qty that preventing item qty reduces at its lowest.
            const filteredItems = items.filter(item => item.qty_in_stock > item.threshold);

            if (filteredItems.length === 0) {
                return res.status(404).json({ message: "No items meet the criteria." });
            }

            res.status(200).json(filteredItems); // Send the filtered list of items
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
            res.status(500).json({ message: "Server error", error });
        });
};


//Get item by ID
const getItemById = (req, res) => {
    const { id } = req.params; // Get the item ID from the URL parameters

    MediInventory.findById(id) // Find the item by its ID
        .then((item) => {
            if (!item) {
                return res.status(404).json({ message: "Item not found" }); // Item not found
            }
            res.status(200).json(item); // Send the item data
        })
        .catch((error) => {
            console.error("Error fetching item:", error); // Log the error for debugging
            res.status(500).json({ message: "Server error", error }); // Return server error
        });
};


//Update Item
const updateItem = (req, res) => {
    const { id } = req.params; // Extract item ID from the request parameters
    const {name, qty_in_stock, unit_price, dosage_form, brand_name, supplier_name, category, expiry_date,threshold } = req.body; // Extract the fields to be updated

    // Validate required fields (if necessary)
    if (!name ||!qty_in_stock || !unit_price || !dosage_form || !brand_name || !supplier_name || !category || !expiry_date || !threshold) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure that the unit_price is a decimal with two decimal places
    const formattedUnitPrice = parseFloat(unit_price).toFixed(2); // Format to two decimal places
    const decimalUnitPrice = mongoose.Types.Decimal128.fromString(formattedUnitPrice); // Convert to Decimal128

    // Update the item in the database
    MediInventory.findByIdAndUpdate(
        id,
        { 
            name,
            qty_in_stock,
            unit_price: decimalUnitPrice,
            dosage_form,
            brand_name,
            supplier_name,
            category,
            expiry_date,
            threshold
        },
        { new: true, runValidators: true } // Options: return updated doc and validate schema
    )
    .then(updatedItem => {
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found." });
        }
        res.status(200).json({
            message: "Item updated successfully.",
            item: updatedItem, // Send the updated item data
        });
    })
    .catch(error => {
        console.error("Error during item update:", error);
        res.status(500).json({ message: "Failed to update item.", error });
    });
};

//Delete Item
const deleteItem = (req, res) => {
    const { id } = req.params; // Extract the item ID from the URL parameters

    // Delete item by ID
    MediInventory.findByIdAndDelete(id)
        .then(deletedItem => {
            if (!deletedItem) {
                return res.status(404).json({ message: "Item not found." }); // Item not found
            }
            res.status(200).json({
                message: "Item deleted successfully.",
                item: deletedItem, // Return the deleted item data
            });
        })
        .catch(error => {
            console.error("Error deleting item:", error); // Log the error for debugging
            res.status(500).json({ message: "Failed to delete item.", error }); // Return server error
        });
};


const getOutofStockItems= (req, res) => {
    // Fetch all items, excluding sensitive fields if needed (e.g., `supplier_name`, `unit_price`, etc.)
    MediInventory.find({})
        .then((items) => {
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "No items found." });
            }
            // res.status(200).json(items); // Send the list of items
            // Filter items where qty_in_stock > threshold

            //added a buffer to the stock qty that preventing item qty reduces at its lowest.
            const filteredItems = items.filter(item => item.qty_in_stock < item.threshold);

            if (filteredItems.length === 0) {
                return res.status(404).json({ message: "No items meet the criteria." });
            }

            res.status(200).json(filteredItems); // Send the filtered list of items
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
            res.status(500).json({ message: "Server error", error });
        });
};

  export { createItem, getAllItems, getItemById, updateItem, deleteItem ,getOutofStockItems};