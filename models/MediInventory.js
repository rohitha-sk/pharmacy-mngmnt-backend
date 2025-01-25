import mongoose from "mongoose";

const mediInventorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    qty_in_stock: {
      type: Number,
      required: true
    },
    unit_price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    dosage_form: {
      type: String,
      required: true
    },
    brand_name: {
      type: String,
      required: true
    },
    supplier_name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    expiry_date: {
      type: Date,
      required: true
    },
    threshold: {
      type: Number,
      required: true
    },
  }
);

const MediInventory = mongoose.model("MediInventory", mediInventorySchema);
export default MediInventory;
