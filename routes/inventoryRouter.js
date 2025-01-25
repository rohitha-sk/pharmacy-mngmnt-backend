import express from 'express'
import { createItem, getAllItems, getItemById, updateItem, deleteItem, getOutofStockItems } from '../controllers/inventoryController.js';

const InventoryRouter = express.Router();


//user management routes
InventoryRouter.post("/add_new_item",createItem);
InventoryRouter.get("/all_items",getAllItems);
InventoryRouter.get("/get_item/:id", getItemById);
InventoryRouter.put("/update_item/:id", updateItem);
InventoryRouter.delete("/delete_item/:id", deleteItem);
InventoryRouter.get("/lower_stock_items", getOutofStockItems);





 export default InventoryRouter; 